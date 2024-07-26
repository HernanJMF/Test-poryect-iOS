import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/messages/message.service';
import { UserService } from 'src/app/core/services/users/user.service';
import { LoginRequest } from 'src/app/shared/models/login/login-request';
import { ToastNotification } from 'src/app/shared/types/ToastNotification';
import { ConfigService } from 'src/app/core/services/config/config.service';
import { LoadingService } from 'src/app/core/services/loading/loading-service.service';
import { PasswordRecoveryComponent } from '../components/password-recovery/password-recovery.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: any;
  loginForm: FormGroup;
  value!: string;
  passwordClass: string = "";
  emailClass: boolean = true;
  isValid: boolean; // variable para la validación de usuario
  showPasswordRecovery = false; //Mostrar modal de password recovery
  visible: boolean = false;
  innerWidth: number;
  path: string = "";

  @Input() page: any = "";

  @ViewChild(PasswordRecoveryComponent) uploadChild: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    protected router: Router,
    private messageService: MessageService,
    private configService: ConfigService,
    private location: Location,
    private loadingService: LoadingService
  ) {

    this.page = this.configService.login("es")
    this.page.default
    if (this.userService.isAuthenticated) {
      this.router.navigate(['/chat']);
    }
    this.resetForm();
    this.innerWidth = window.innerWidth;
    this.path = this.router.url
    if(this.path == '/validation/login'){
      this.location.replaceState("/login");
    }
  }

  resetForm(){ //Formulario de login
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.loginForm.statusChanges.subscribe(status => {
      this.isValid = status == "VALID" ? true : false;
      this.passwordClass = (this.loginForm.controls['password'].touched && this.loginForm.controls['password'].errors?.['required']) ?
                            "ng-invalid ng-dirty" : "";
      this.emailClass = (this.loginForm.controls['email'].touched && this.loginForm.controls['email'].errors?.['required']) ?
                          false : true;
    });
  }

  ngOnInit(): void {

  }

  onSubmit() {
    //Enviar la solicitud para loguear
    let loginBody = new LoginRequest(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
    this.loadingService.show();
    this.userService.login(loginBody).subscribe({
      next: () => {
        this.loadingService.hide();
        this.router.navigate(['/chat'])
          .then(() => {
            window.location.reload();
          });
      },
      error: () => {
        this.loadingService.hide();
        // Aquí puedes manejar errores si ocurren
        const notification: ToastNotification = {
          title: 'Invalid Credentials',
          content: 'Oops! It looks like your login information is incorrect. Please double-check your email and password and try again.',
          success_status: false,
        };
        this.messageService.Notify(notification);
      }
    })
  }

  showDialog(){
    this.uploadChild.showDialog();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
  }

}
