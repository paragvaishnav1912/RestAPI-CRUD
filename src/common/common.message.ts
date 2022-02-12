class generateMessage{
    
    validation(message:any,status:string,code:number){
        return {
            "message":message,
            "status":status,
            "statusCode":code
        }
    }
}

export default new generateMessage();