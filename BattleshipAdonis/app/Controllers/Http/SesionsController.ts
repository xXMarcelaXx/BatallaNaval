import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

export default class SesionsController {
  url = 'mongodb+srv://marce:1234@cluster0.i041f3u.mongodb.net/test';
  client = new MongoClient(this.url);
  dbName = 'Battelship';

  public async index({ response }: HttpContextContract) {
    try{

      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      const sesion = await collection.find({}, {sort: {_id: -1}}).toArray();

      this.client.close()

      response.ok({message: "Consulta Correcta", data: sesion})
    }
    catch(error)
    {
      response.internalServerError({message: "Ocurrio un error"})
    }
  }

  //public async create({}: HttpContextContract) {}

  public async store({ response, request }: HttpContextContract) {
       try{   

      const datos = request.all();

      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      const data1 = await collection.insertOne(datos)

      this.client.close()


      response.ok({message: "insercion correcta", data: data1})        
      }

    
    catch(error)
    {
      response.badRequest({message: "Ocurrio un error"})
    }
  }

  
  public async show({ response, params }: HttpContextContract) {
    try{
      const { id } = params;
      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      const sesion = await collection.findOne({_id: new ObjectId(id)})

      response.ok({message: "Todo correcto", data: sesion})
      this.client.close()


    }
    catch(error)
    {
      response.badRequest({message: "Ocurrio un error"})
    }
  }
  //public async edit({}: HttpContextContract) {}
  public async update({ response, request, params }: HttpContextContract) {
    try{
      const { id } = params;

      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      await collection.updateOne({_id: new ObjectId(id)},  { $set: 
        {tablero_host: request.input('tablero_host'),
       tablero_invitado: request.input('tablero_invitado'), 
       turno: request.input('turno')}
      })
      this.client.close()


      response.ok({message: "Actualizacion correcto"})
    }
    catch(error)
    {
      response.badRequest({message: "Ocurrio un error"})
    }
  }

  public async ActGyE({ response, request, params }: HttpContextContract){
    try{
      const { id } = params;

      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      await collection.updateOne({_id: new ObjectId(id)},  { $set: 
        {ganador: request.input('ganador'), 
        estado: request.input('estado')}
      })

      this.client.close()

      response.ok({message: "Actualizacion correcto"})
    }
    catch(error)
    {
      response.badRequest({message: "Ocurrio un error"})
    }
  }

  public async ActInvitado({ response, request, params }: HttpContextContract)
  {
    try{
      const { id } = params;

      await this.client.connect();
      const db = this.client.db(this.dbName);
      const collection = db.collection('sesiones');

      await collection.updateOne({_id: new ObjectId(id)},  { $set: 
        {invitado: request.input('invitado')}
      })
      this.client.close()

      response.ok({message: "Actualizacion correcto"})
    }
    catch(error)
    {
      response.badRequest({message: "Ocurrio un error"})
    }
  }


}
