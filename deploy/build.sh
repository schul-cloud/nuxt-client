#! /bin/bash

# ----------------
# DECLERATIONS
# ----------------

set -e # fail with exit 1 on any error

while getopts p: option
do
case "${option}"
in
p) PROJECT=${OPTARG};;
esac
done
echo PROJECT $PROJECT

# [OPS-1664] Enhance all branches with Tag latest
if [[ "$TRAVIS_BRANCH" == "master" ]]
then
	export DOCKERTAG=master_v$( jq -r '.version' package.json )_latest
elif [[ "$TRAVIS_BRANCH" == "develop" ]]
then
	export DOCKERTAG=develop-latest
elif [[ "$TRAVIS_BRANCH" =~ ^"release"* ]]
then
	export DOCKERTAG=release_v$( jq -r '.version' package.json )_latest
elif [[ "$TRAVIS_BRANCH" =~ ^hotfix\/[A-Z]+-[0-9]+-[a-zA-Z_]+$ ]]
then
	# extract JIRA_TICKET_ID from TRAVIS_BRANCH
	JIRA_TICKET_ID=${TRAVIS_BRANCH/#hotfix\//}
	JIRA_TICKET_TEAM=${JIRA_TICKET_ID/%-*/}
	JIRA_TICKET_ID=${JIRA_TICKET_ID/#$JIRA_TICKET_TEAM"-"/}
	JIRA_TICKET_ID=${JIRA_TICKET_ID/%-*/}
	JIRA_TICKET_ID=$JIRA_TICKET_TEAM"-"$JIRA_TICKET_ID
	# export DOCKERTAG=naming convention feature-<Jira id>-latest
	export DOCKERTAG=$( echo "hotfix_"$JIRA_TICKET_ID"_latest")
elif [[ "$TRAVIS_BRANCH" =~ ^feature\/[A-Z]+-[0-9]+-[a-zA-Z_]+$ ]]
then
	# extract JIRA_TICKET_ID from TRAVIS_BRANCH
	JIRA_TICKET_ID=${TRAVIS_BRANCH/#feature\//}
	JIRA_TICKET_TEAM=${JIRA_TICKET_ID/%-*/}
	JIRA_TICKET_ID=${JIRA_TICKET_ID/#$JIRA_TICKET_TEAM"-"/}
	JIRA_TICKET_ID=${JIRA_TICKET_ID/%-*/}
	JIRA_TICKET_ID=$JIRA_TICKET_TEAM"-"$JIRA_TICKET_ID
	# export DOCKERTAG=naming convention feature-<Jira id>-latest
	export DOCKERTAG=$( echo "feature_"$JIRA_TICKET_ID"_latest")
else
	# Check for naming convention <branch>/<JIRA-Ticket ID>-<Jira_Summary>
	# OPS-1664
	echo -e "Event detected. However, branch name pattern does not match requirements to deploy. Expected <branch>/<JIRA-Ticket ID>-<Jira_Summary> but got $TRAVIS_BRANCH"
	exit 0
fi

echo "DOCKERTAG" $DOCKERTAG
echo "GITSHA" $GIT_SHA
echo "Branch" $TRAVIS_BRANCH

# ----------------
# SCRIPTS
# ----------------

dockerPush(){
	# $1: Project Name (client, storybook, vuepress)
	# $2: docker tag to use

	# Log in to the docker CLI
	echo "$MY_DOCKER_PASSWORD" | docker login -u "$DOCKER_ID" --password-stdin

	# Push Image
	docker push schulcloud/schulcloud-nuxt-$1:$2
}

# BUILD SCRIPTS

buildClient(){
	# write version file
	# JS syntax is required so we can import it
	printf "module.exports = {\n  sha: \`%s\`,\n  branch: \`%s\`,\n  message: \`%s\`\n}" $TRAVIS_COMMIT "${TRAVIS_BRANCH//\`/\\\`}" "${TRAVIS_COMMIT_MESSAGE//\`/\\\`}" > ../version.js

	cat ../version.js

	docker build \
		-t schulcloud/schulcloud-nuxt-client:$DOCKERTAG \
		-t schulcloud/schulcloud-nuxt-client:$GIT_SHA \
		-f Dockerfile.client \
		../

	# If branch is develop, add and push additional docker tags
	if [[ "$TRAVIS_BRANCH" = "develop" ]]
	then
		docker tag schulcloud/schulcloud-nuxt-client:$DOCKERTAG schulcloud/schulcloud-nuxt-client:develop_latest
		dockerPush "client" "develop_latest"
	elif [[ "$TRAVIS_BRANCH" = feature* ]]
	# If branch is feature, add and push additional docker tags
	then
		dockerPush "client" $DOCKERTAG
	else
		dockerPush "client" $DOCKERTAG
		dockerPush "client" $GIT_SHA
	fi
}

buildStorybook(){
	docker build \
		-t schulcloud/schulcloud-nuxt-storybook:$DOCKERTAG \
		-t schulcloud/schulcloud-nuxt-storybook:$GIT_SHA \
		-f Dockerfile.storybook \
		../

	# If branch is develop, add and push additional docker tags
	if [[ "$TRAVIS_BRANCH" = "develop" ]]
	then
		docker tag schulcloud/schulcloud-nuxt-storybook:$DOCKERTAG schulcloud/schulcloud-nuxt-storybook:develop_latest
		dockerPush "storybook" "develop_latest"
	elif [[ "$TRAVIS_BRANCH" = feature* ]]
	# If branch is feature, add and push additional docker tags
	then
		dockerPush "storybook" $DOCKERTAG
	else
		dockerPush "storybook" $DOCKERTAG
		dockerPush "storybook" $GIT_SHA
	fi
}

buildVuepress(){
	docker build \
		-t schulcloud/schulcloud-nuxt-vuepress:$DOCKERTAG \
		-t schulcloud/schulcloud-nuxt-vuepress:$GIT_SHA \
		-f Dockerfile.vuepress \
		--build-arg ALGOLIA_NAME \
		--build-arg ALGOLIA_API_KEY \
		../

	# If branch is develop, add and push additional docker tags
	if [[ "$TRAVIS_BRANCH" = "develop" ]]
	then
		docker tag schulcloud/schulcloud-nuxt-vuepress:$DOCKERTAG schulcloud/schulcloud-nuxt-vuepress:develop_latest
		dockerPush "vuepress" "develop_latest"
	# If branch is feature, add and push additional docker tags
	elif [[ "$TRAVIS_BRANCH" = feature* ]]
	then
		dockerPush "vuepress" $DOCKERTAG
	else
		dockerPush "vuepress" $DOCKERTAG
		dockerPush "vuepress" $GIT_SHA
	fi
}

# ----------------
# MAIN SCRIPT
# ----------------
cd deploy

source ./buildAndDeployFilter.sh
buildAndDeployFilter

bash ./decryptSecrets.sh

if [[ $PROJECT == "client" ]]
then
	buildClient
elif [[ $PROJECT == "storybook" ]]
then
	buildStorybook
elif [[ $PROJECT == "vuepress" ]]
then
	buildVuepress
else
  echo "Nothing to build defined"
	exit 1
fi

exit 0
