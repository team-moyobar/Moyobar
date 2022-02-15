pipeline {
	agent none
	options { skipDefaultCheckout(false) }
	stages {
		stage('git pull') {
			agent any
			steps {
				mattermostSend (
                            			color: "#2A42EE", 
                            			message: "Build STARTED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
                        		)  
				checkout scm
			}
		}
		stage('Docker build') {
			agent any
			steps {
				script {
                    	try {
                            sh 'docker-compose build'
					}catch(e) {
                        				mattermostSend (
                                					color: "danger", 
                                					message: "Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
                            				)
                    				} 
				}
			}
		}
		stage('Docker run') {
			agent any
			steps {
				script {
                    				try {
                                        sh 'docker-compose up -d'
					}catch(e) {
						currentBuild.result = "FAILURE"
                    				} finally {
						if(currentBuild.result == "FAILURE"){
							mattermostSend (
                                						color: "danger", 
                                						message: "Build FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
                            					)
						}
						else{
							mattermostSend (
                                						color: "good", 
                                						message: "Build SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER} (<${env.BUILD_URL}|Link to build>)"
                            					)
						}
					}
				}
			}
		}
	}
}