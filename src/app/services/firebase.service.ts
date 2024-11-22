import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, getFirestore } from '@angular/fire/firestore';
import { getStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = getAuth();
  firestore: Firestore = getFirestore();
  storage = getStorage();

  constructor(
  ) { }


  
}
