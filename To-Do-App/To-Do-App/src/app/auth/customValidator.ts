import { AbstractControl } from "@angular/forms";


export class CustomValidator{

    static usernameValidator(control: AbstractControl){
      let username = control.value as string;
      if(username.trimEnd().includes(' ')) return {Spaces: true}
      username = username.trim();
      if(username.length == 0) return {required: true}
      if(username.length > 50) return {maxLengthExceeded: true}
      return null;
    }


    static passwordValidator(control: AbstractControl){
      let password = control.value as string;
      if(password.startsWith(' ')) return {Leadingspaces: true}
      password = password.trim();
      if(password.length == 0) return {required: true}
      if(password.length < 8) return {minLengthRequired: true}
      // if(/[A-Z]/.test(password)) return {requiredUpperCase: true}
      // if(/[a-z]/.test(password)) return {requiredLowerCase: true}
      // if(/[0-9]/.test(password)) return {requiredNumber: true}
      // if(/[!@#$%^&*(),.?":{}|<>]/.test(password)) return {requiredNumber: true}
      return null;
    }
}