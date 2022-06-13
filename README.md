# AWS Dynamo Lambda Api Gateway S3 Nodejs

En este repositorio tenemos código como infraestructura, en el cual usuamos DynamoDB, Lambda, Api Gateway, CloudFormation, IAM.

Se realizan las operaciones básicas de CRUD.

Obtenemos datos de un archivo json que se encuentra en un bucket de S3 y lo procesamos,para hacer un insert multiple de los datos del archivo a una tabla en DynamoDB.

Tambien hemos utilizado ```serverless-iam-roles-per-function``` para la permisologia de cada Lambda.

Utilizamos el ```SDK v3``` de AWS para generar el código de nuestras Lambdas y poder obtener el archivo del S3.


## Usage

### Deployment

Para llevar a cabo el deploy utilizamos el siguiente comando:

```
$ serverless deploy
```

Si luego queremos eliminar la infraestructura solo debemos ejecutar

```
$ serverless remove
```

Demos contar con nuestra cuenta respectiva de AWS