import { Component, Input } from '@angular/core';
import { Post } from './shared-classes-and-interfaces/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'hello-there-app';

  // posts: Post[] = [];


  // onPostCreated(post) {
  //   this.posts.push(post);
  // }

}
