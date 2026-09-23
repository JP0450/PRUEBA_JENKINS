// Jenkinsfile declarativo
// Este pipeline muestra el rol de Jenkins como ORQUESTADOR
// y de Docker como el ENTORNO DE EJECUCIÓN aislado para el QA.

pipeline {
    agent any

    environment {
        IMAGE_NAME = "calculadora-qa-demo"
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                // Jenkins descarga el código fuente desde el repositorio
                echo "Descargando código fuente..."
                checkout scm
            }
        }

        stage('Build de imagen Docker') {
            steps {
                echo "Construyendo imagen Docker con el entorno de pruebas..."
                bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Ejecutar pruebas de QA en Docker') {
            steps {
                echo "Ejecutando pruebas dentro de un contenedor Docker..."
                // Se copia el reporte con docker cp para evitar permisos del volumen
                // compartido entre Docker Desktop y el servicio Jenkins de Windows.
                bat """
                    if not exist reports mkdir reports
                    set "TEST_EXIT=0"
                    docker run --name ${IMAGE_NAME}-${IMAGE_TAG} ${IMAGE_NAME}:${IMAGE_TAG} || set "TEST_EXIT=%ERRORLEVEL%"
                    docker cp ${IMAGE_NAME}-${IMAGE_TAG}:/app/reports/junit.xml reports/junit.xml
                    docker rm ${IMAGE_NAME}-${IMAGE_TAG}
                    if not "%TEST_EXIT%"=="0" exit /b %TEST_EXIT%
                """
            }
        }

        stage('Publicar reporte de QA') {
            steps {
                echo "Publicando resultados de las pruebas en Jenkins..."
                junit 'reports/junit.xml'
            }
        }

        stage('Limpieza') {
            steps {
                echo "Eliminando imagen temporal..."
                bat "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || exit /b 0"
            }
            post {
                always {
                    bat "docker rm -f ${IMAGE_NAME}-${IMAGE_TAG} 2>nul || exit /b 0"
                }
            }
        }
    }

    post {
        success {
            echo "✅ QA superado: todas las pruebas pasaron."
        }
        failure {
            echo "❌ QA falló: revisar el reporte de pruebas en Jenkins."
        }
        always {
            // Guarda el reporte como artefacto del build, aunque falle
            archiveArtifacts artifacts: 'reports/*.xml', allowEmptyArchive: true
        }
    }
}
