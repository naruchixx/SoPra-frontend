import {Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Room} from '../models/room';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user';

@Injectable()
export class RoomService {
  private apiUrl: string;
  public token: string; // we probably need the actual token of a certain player
  public roomUrl: string;

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) {

    /*TODO fill in your heroku-backend URL*/
    this.apiUrl = 'https://sopra-fd2af.firebaseio.com/1/rooms.json';
    this.roomUrl = 'https://sopra-fd2af.firebaseio.com/1/rooms/0/PlayersInRoom.json';
  }

  getRooms(): Observable<Room[]> {
    /*const httpOptions = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.authenticationService.token})
    }; */
    // get users from api
    return this.http.get<Room[]>(this.apiUrl);
  }


  joinRoomLogin(user: User): Observable<User> {
    // this.testID += 1;
    const bodyString = JSON.stringify({username: 'sv1008'}); // this has to be changed to the actual user's username
    // const userID = JSON.stringify({id: user.id})

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<User>(this.roomUrl, bodyString, httpOptions).map((fetchedUser: User) => {
      if (user) {
        // set token property
        this.token = fetchedUser.token;

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({username: fetchedUser.username, token: this.token}));

        // return true to indicate successful login
        return user;
      } else {
        // return false to indicate failed login
        return null;
      }
    }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  roomLogin(room: Room): Observable<Room> {
    // this.testID += 1;
    const bodyString = JSON.stringify({roomname: room.name, id : this.assignUniqueID()});
    // const userID = JSON.stringify({id: user.id})

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<User>(this.roomUrl, bodyString, httpOptions).map((fetchedUser: User) => {
      if (room) {
        // set token property
        this.token = fetchedUser.token;

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({username: fetchedUser.username, token: this.token}));

        // return true to indicate successful login
        return room;
      } else {
        // return false to indicate failed login
        return null;
      }
    }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
