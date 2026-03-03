import {Schema,model} from 'mongoose';

const meetingScema = new Schema(
    {
        meetingId:{type:Star},
        meetingCode:{type:String, required:true},
        data:{type: Date, default:Date.now, required:true}
    }
)

const Meeting= model("Meeting",meetingScema);
export {Meeting};