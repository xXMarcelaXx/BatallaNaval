import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import usuario from 'App/Models/Usuario'
import AuthStoreValidator from 'App/Validators/AuthStoreValidator'
import { MongoClient } from 'mongodb';

export default class AuthController {

  url = 'mongodb+srv://marce:1234@cluster0.i041f3u.mongodb.net/test';
  client = new MongoClient(this.url);
  dbName = 'Battelship';

  public async login({ request, response, auth }: HttpContextContract)
  {
    try {
      const email = request.input('email')
      const password = request.input('password')

      try {
          const token = await auth.use('api').attempt(email, password)
          response.ok({message: "Login Exitoso", token: token, username: auth.user?.username})
      }
      catch {
          return response.badRequest('Invalid credentials')
      }
  }
  catch (error) {
      response.internalServerError({ message: "error" })
  }
  }

  public async register({ request, response, auth }: HttpContextContract)
  {
    try
    {
      const validacion = await request.validate(AuthStoreValidator)
      try{
      await usuario.create(validacion)

      const token = await auth.attempt(validacion.email, validacion.password)

      response.ok({message: "Registro Correcto", token: token, username: validacion.username})        
      }
      catch(error)
      {
        response.badRequest({message: error})

      }


    }
    catch(error)
    {
      response.badRequest({message: error})
    }
  }

  


  public async datoUsuario({ response, auth }: HttpContextContract)
  {
    try
    {
      response.ok({message: "Consulta Correcta", data: auth.user?.username})
    }
    catch(error)
    {
      response.badRequest({message: "Revisa los datos"})
    }
  }

  public async logout({ response, auth }: HttpContextContract)
  {
    try
    {
      await auth.use('api').revoke()
      
      response.ok({message: "Se cerro correctamente la sesion", revoked: true})
    }
    catch(error)
    {
      response.badRequest({message: "Revisa los datos"})
    }
  }


  public async prueba({ response, }: HttpContextContract)
  {
    const sensor = {"holaaaa":"hola"};  
    await this.client.connect();
    const db = this.client.db(this.dbName);
    const collection = db.collection('PruebaBarco');
    
    try
    {
          const insertResult = await collection.insertOne(sensor);

      response.ok({message: insertResult})
    }
    catch(error)
    {
      response.badRequest({message: "No se inserto"})
    }
  }



  
}
