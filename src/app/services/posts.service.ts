import { Injectable } from '@angular/core';
import { Post } from '../shared-classes-and-interfaces/post';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    // return [...this.posts];
    this.http.get<{message: string, data: any}>('http://localhost:3000/posts')
      .pipe(map(postData => {
        return postData.data.map(post => {
          return {
            id: post._id,
            title: post.title,
            content: post.content
          };
        });
      }))
      .subscribe(data => {
        this.posts = data;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>(`http://localhost:3000/posts/${id}`);
  }

  addPost(post: Post) {
    this.http.post<{message: string, postId: string}>('http://localhost:3000/posts', post)
      .subscribe((response) => {
        console.log(response.message);
        const generatedID = response.postId;
        post.id = generatedID;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const updatedPost = {
      id,
      title,
      content
    };
    this.http.put(`http://localhost:3000/posts/${id}`, updatedPost)
      .subscribe(response => {
        console.log(response);
      });
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
