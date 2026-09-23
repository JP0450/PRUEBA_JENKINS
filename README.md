# Muestra: Jenkins + Docker aplicados a QA

Este proyecto es una demostración mínima pero completa de cómo **Jenkins** y **Docker**
se combinan para automatizar el control de calidad (QA) de una aplicación.

## ¿Qué rol cumple cada herramienta?

| Herramienta | Rol en el QA |
|---|---|
| **Docker** | Empaqueta la aplicación y sus dependencias en un entorno idéntico, aislado y reproducible. Las pruebas corren siempre igual, sin importar en qué máquina se ejecute Jenkins. |
| **Jenkins** | Orquesta el proceso: detecta cambios en el código, construye la imagen Docker, ejecuta las pruebas dentro del contenedor, recoge los resultados y decide si el build pasa o falla. |

## Estructura del proyecto

```
jenkins-docker-qa-demo/
├── src/
│   └── calculadora.js        # Código de la aplicación
├── test/
│   └── calculadora.test.js   # Pruebas unitarias (QA) con Jest
├── package.json              # Dependencias y script de test
├── Dockerfile                # Define el entorno donde corren las pruebas
├── Jenkinsfile                # Pipeline de CI/CD que orquesta todo
└── README.md
```

## Flujo del pipeline (lo que hace el Jenkinsfile)

1. **Checkout** – Jenkins descarga el código fuente del repositorio.
2. **Build de imagen Docker** – Se construye una imagen que contiene Node.js,
   la app y las pruebas, usando el `Dockerfile`.
3. **Ejecutar pruebas de QA en Docker** – Jenkins levanta un contenedor a partir
   de esa imagen y corre `npm test` (Jest) dentro de él. El contenedor es
   desechable: se crea, ejecuta las pruebas y se destruye.
4. **Publicar reporte de QA** – El resultado de las pruebas (en formato JUnit XML)
   se recupera del contenedor y Jenkins lo muestra como reporte visual
   (pruebas pasadas/fallidas, con detalle por caso).
5. **Limpieza** – Se elimina la imagen temporal para no acumular basura en el
   agente de Jenkins.
6. **Post (success/failure)** – Jenkins marca el build como ✅ o ❌ según el
   resultado, y esto puede usarse para bloquear un despliegue si el QA falla.

## Cómo probarlo localmente (sin Jenkins, solo Docker)

```bash
# 1. Construir la imagen
docker build -t calculadora-qa-demo .

# 2. Ejecutar las pruebas dentro del contenedor
mkdir -p reports
docker run --rm -v $(pwd)/reports:/app/reports calculadora-qa-demo

# 3. Ver el reporte generado
cat reports/junit.xml
```

## Cómo probarlo con Jenkins

1. Sube este proyecto a un repositorio Git (GitHub, GitLab, etc.).
2. En Jenkins, crea un **Pipeline job** y apunta al repositorio
   (opción "Pipeline script from SCM").
3. Asegúrate de que el agente de Jenkins tenga **Docker instalado** y el
   usuario `jenkins` tenga permisos para usar el socket de Docker.
4. Ejecuta el build ("Build Now") y observa cómo Jenkins pasa por cada
   etapa (`Checkout` → `Build` → `Test` → `Publish` → `Cleanup`).
5. Al finalizar, en la vista del build verás el reporte de pruebas
   (**Test Result**) generado automáticamente a partir de `reports/junit.xml`.

## Idea para la presentación/sustentación

- Muestra primero el `Jenkinsfile` explicando cada etapa.
- Corre el flujo manual con Docker (los 3 comandos de arriba) para que se vea
  qué hace Jenkins "por dentro" en la etapa de test.
- Opcional: rompe intencionalmente una prueba en `calculadora.test.js`
  (por ejemplo cambia `expect(sumar(2, 3)).toBe(5)` por `.toBe(6)`) y vuelve
  a correr el pipeline para mostrar cómo Jenkins detecta el fallo de QA y
  marca el build en rojo.
