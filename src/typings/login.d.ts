declare namespace Login{

    interface LoginReqest{
        username:string 
        password:string
        vcode?:string
        otp?:string
        deviceId?:string
        trustDevice?:boolean
    }

	interface LoginResponse extends User.Info{
		token :string
		needBind?:boolean
		bindToken?:string
		otpAuth?:string
		username?:string
	}

    interface ResetPasswordByVCodeReqest extends System.Register.SendRegisterVcodeRquest{
    }

}