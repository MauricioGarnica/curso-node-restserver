import mongoose from "mongoose"
const con = mongoose;

const dbConnection = async() => {
    try{
        await con.connect(process.env.MONGOBD_ATLAS_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //useFindAndModify: false
        });

        console.log('Base de datos online');
    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD');
    }
}

export{
    dbConnection
}