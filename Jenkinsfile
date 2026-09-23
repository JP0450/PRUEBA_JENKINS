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
                // Se monta la carpeta 'reports' para recuperar el resultado
                // fuera del contenedor una vez terminan las pruebas.
                bat """
                    if not exist reports mkdir reports
                    docker run --rm -v "%WORKSPACE%\\reports:/app/reports" \
                        ${IMAGE_NAME}:${IMAGE_TAG}
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
