
interface otpData{
    otp:number;
    timestamp:number;
}

const otpStore=new Map<String,otpData>();
export default otpStore;