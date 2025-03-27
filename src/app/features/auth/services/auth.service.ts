import { Injectable } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  UserCredential, 
  AuthError,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  private async saveUserData(user: any, providerData?: any) {
    try {
      const userDoc = doc(this.firestore, `usuarios/${user.uid}`);
      const userData = {
        nombre: providerData?.nombre || user.displayName || '',
        email: user.email,
        fechaRegistro: new Date(),
        uid: user.uid,
        photoURL: user.photoURL || null,
        provider: providerData ? 'email' : user.providerData[0].providerId
      };

      await setDoc(userDoc, userData);
      console.log('Documento de usuario creado exitosamente');
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
      throw new Error('Error al guardar los datos del usuario');
    }
  }

  async registerUser(userData: {
    nombre: string;
    email: string;
    fechaNacimiento: Date;
    password: string;
  }): Promise<UserCredential> {
    try {
      if (!userData.email || !userData.password || !userData.nombre || !userData.fechaNacimiento) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Validar el formato del email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('El formato del email no es válido');
      }

      // Validar la contraseña
      if (userData.password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      // Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      try {
        await this.saveUserData(userCredential.user, {
          nombre: userData.nombre,
          fechaNacimiento: userData.fechaNacimiento
        });
      } catch (firestoreError) {
        // Si falla la creación del documento, eliminamos el usuario de Auth
        await userCredential.user.delete();
        throw new Error('Error al guardar los datos del usuario. Por favor, intenta nuevamente.');
      }

      await this.router.navigate(['/welcome']);
      return userCredential;
    } catch (error: any) {
      await this.router.navigate(['/welcome']);
      
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este correo electrónico ya está registrado');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('El formato del email no es válido');
      } else if (error.code === 'auth/operation-not-allowed') {
        throw new Error('El registro de usuarios está deshabilitado');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña es demasiado débil');
      } else if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Error durante el registro');
      }
    }
  }

  async signInWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      await this.saveUserData(result.user);
      await this.router.navigate(['/welcome']);
      return result;
    } catch (error: any) {
      await this.router.navigate(['/welcome']);
      console.error('Error al iniciar sesión con Google:', error);
      throw new Error('Error al iniciar sesión con Google');
    }
  }

  async signInWithFacebook(): Promise<UserCredential> {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      await this.saveUserData(result.user);
      await this.router.navigate(['/welcome']);
      return result;
    } catch (error: any) {
      await this.router.navigate(['/welcome']);
      console.error('Error al iniciar sesión con Facebook:', error);
      throw new Error('Error al iniciar sesión con Facebook');
    }
  }

  async signInWithGithub(): Promise<UserCredential> {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      await this.saveUserData(result.user);
      await this.router.navigate(['/welcome']);
      return result;
    } catch (error: any) {
      await this.router.navigate(['/welcome']);
      console.error('Error al iniciar sesión con Github:', error);
      throw new Error('Error al iniciar sesión con Github');
    }
  }
} 