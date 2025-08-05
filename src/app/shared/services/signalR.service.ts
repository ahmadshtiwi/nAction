import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';
// import { Notification } from '../models/notifications';
// import { SignalRNotificationResponse } from '../models/signalR';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: HubConnection; // هون بنعرف متغير للاتصال بـ SignalR
  public notificationReceived: Subject<any> = new Subject<any>(); // متغير لتخزين الإشعارات اللي بنستلمها
  private userId: string; // متغير لتخزين رقم المستخدم

  constructor() {
    this.userId = localStorage.getItem('id') || 'default-user-id'; // بنجيب رقم المستخدم من التخزين المحلي أو بنحط رقم افتراضي
    this.startConnection(); // بنبدأ الاتصال بـ SignalR
    //this.addNotificationListener(); // بنضيف مستمع للإشعارات
  }

  private startConnection() { 
    const token = localStorage.getItem('_accessToken'); // بنجيب التوكن من التخزين المحلي
    console.log('Starting connection with token:', token); // بنطبع التوكن للتأكد إنه موجود

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7133/uploadProgressHub`, {
        accessTokenFactory: () => token! // بنستخدم التوكن للاتصال
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started successfully'); // بنطبع رسالة لما ينجح الاتصال
        // this.subscribeToUser(this.userId); // بنضيف المستخدم للجروب لما ينجح الاتصال
      })
      .catch(err => {
        console.error('Error while starting connection:', err); // بنطبع أي خطأ بصير لما نحاول نبدأ الاتصال
      });
  }

  // private addNotificationListener() {
  //   this.hubConnection.on('ReceiveNotification', (notification: SignalRNotificationResponse) => {
  //     console.log('Notification received:', notification); // بنطبع الإشعار اللي بنستلمه
  //     this.notificationReceived.next(notification); // بنبعت الإشعار للمشتركين
  //   });
  // }

  public subscribeToUser(userId: string) { 
    if (this.hubConnection.state === 'Connected') { // بنشيك إذا الاتصال جاهز
      this.hubConnection.invoke("SubscribeToUser", userId) // بنطلب الاشتراك للمستخدم
        .then(() => {
          console.log(`Subscribed to user ${userId}`); // بنطبع رسالة لما ينجح الاشتراك
        })
        .catch(err => {
          console.error('Error while subscribing:', err); // بنطبع أي خطأ بصير لما نحاول نشترك
        });
    } else {
      this.hubConnection.on('connected', () => { // إذا الاتصال مش جاهز، بنستنى لحد ما يصير جاهز
        this.hubConnection.invoke("SubscribeToUser", userId) // بنطلب الاشتراك للمستخدم
          .then(() => {
            console.log(`Subscribed to user ${userId}`); // بنطبع رسالة لما ينجح الاشتراك
          })
          .catch(err => {
            console.error('Error while subscribing:', err); // بنطبع أي خطأ بصير لما نحاول نشترك
          });
      });
    }
  }
  public UploadProgress() { 
    this.hubConnection.on('UploadProgress', (notification: {fileId , progress}) => {
          console.log('Notification received:', notification); // بنطبع الإشعار اللي بنستلمه
          this.notificationReceived.next(notification); // بنبعت الإشعار للمشتركين
        });
     
    }
  

  
     
    
  

  public unsubscribeFromUser(userId: string) {
    if (this.hubConnection.state === 'Connected') { // بنشيك إذا الاتصال جاهز
      this.hubConnection.invoke("UnsubscribeFromUser", userId) // بنطلب إلغاء الاشتراك للمستخدم
        .then(() => {
          console.log(`Unsubscribed from user ${userId}`); // بنطبع رسالة لما ينجح إلغاء الاشتراك
        })
        .catch(err => {
          console.error('Error while unsubscribing:', err); // بنطبع أي خطأ بصير لما نحاول نلغي الاشتراك
        });
    } else {
      this.hubConnection.on('connected', () => { // إذا الاتصال مش جاهز، بنستنى لحد ما يصير جاهز
        this.hubConnection.invoke("UnsubscribeFromUser", userId) // بنطلب إلغاء الاشتراك للمستخدم
          .then(() => {
            console.log(`Unsubscribed from user ${userId}`); // بنطبع رسالة لما ينجح إلغاء الاشتراك
          })
          .catch(err => {
            console.error('Error while unsubscribing:', err); // بنطبع أي خطأ بصير لما نحاول نلغي الاشتراك
          });
      });
    }
  }
}