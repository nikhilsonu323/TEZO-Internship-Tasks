import { Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { ApiService } from "../../Services/api.service";


export class CustomValidator{
  static ageValidator(formGroup: AbstractControl){
      let dob: string | null = formGroup.get('dateOfBirth')?.value;
      let joiningDate: string | null = formGroup.get('joiningDate')?.value;
      
      if(dob === null || dob.length === 0 || joiningDate === null || joiningDate.length === 0 ) return null;
      let age = CustomValidator.getAge(new Date(dob), new Date(joiningDate))
      
      return age >= 18 ? null : {underAge: true} ;
  }

  static dobValidator(control: AbstractControl){
      if(control.value === null) return null;

      let age = CustomValidator.getAge(new Date(control.value), new Date());
  
      return age < 18 ? {underAge: true} : null;
  }

  static joiningDate(control: AbstractControl){
      if(control.value === null) return null;

      let joiningDate = new Date(control.value);

      return joiningDate.getTime() > Date.now() ? {joiningDateExceedsCurrentDate: true} : null;
  }

  static validateProfile(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
    
    if (!allowedTypes.includes(file.type)) {
      return "Invalid File Type. Only JPEG and PNG are allowed.";
    }

    if (file.size > maxSizeInBytes) {
      return "File size exceeds the maximum limit of 2MB";
    }
    return null;
  }

  static passwordValidator(control: AbstractControl){
    const password = control.value;

    if(password.length < 8) return {minLengthRequired: true}
    if(/[A-Z]/.test(password)) return {requiredUpperCase: true}
    if(/[a-z]/.test(password)) return {requiredLowerCase: true}
    if(/[0-9]/.test(password)) return {requiredNumber: true}
    if(/[!@#$%^&*(),.?":{}|<>]/.test(password)) return {requiredNumber: true}

    return null;
  }
  
  static validateImage(file: File) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB

    if (!allowedTypes.includes(file.type)) {
      return {Invalid_File_Type : true};
    }

    if (file.size > maxSizeInBytes) {
      return {File_Size_Exceeds : true};
    }
    return null;
  }
  
  private static getAge(pastDate: Date, FutureDate: Date){
    let age = FutureDate.getFullYear() - pastDate.getFullYear();
    const monthDiff = FutureDate.getMonth() - pastDate.getMonth();
    const dayDiff = FutureDate.getDate() - pastDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0))
        age--;

    return age;
  }
}

@Injectable({ providedIn: 'root' })
export class AsyncValidators {
  constructor(private apiService: ApiService){ }

  employeeNumberValidator(control: AbstractControl) {
    return new Promise<ValidationErrors | null>((resolve) =>{
        this.apiService.getEmployeeById(control.value).subscribe(emp =>{
            if(emp === null) 
                resolve(null);
            else
                resolve({employeeNumberExists: true});
        })
    });
  }
}
