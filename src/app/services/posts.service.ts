import { Injectable } from '@angular/core';
import { Post } from '../shared-classes-and-interfaces/post';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postsCount: number }>();

  constructor(private http: HttpClient) {}

  getPosts(postsperPage: number, currentPage: number) {

    const queryParams = `?pagesize=${postsperPage}&page=${currentPage}`;

    this.http.get<{ message: string, data: any, maxPosts: number }>(`http://localhost:3000/posts${queryParams}`)
      // pipe(): allows  us to add and use operators from 'rxjs/operators'
      .pipe(map(postData => { // postData.data => Post[]
        return {
          posts: postData.data.map(post => {
          return {
            id: post._id, // our Post model has id, BUT mongoDB returns to us _id => we need to transfer it before .subscribe()
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts };
      }))
      .subscribe(transformedData => {
        this.posts = transformedData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postsCount: transformedData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http
      .get<{_id: string, title: string, content: string}>(`http://localhost:3000/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: Post}>('http://localhost:3000/posts', postData)
      .subscribe((response) => {
        // const post: Post = {
        //   id: response.post.id,
        //   title: title,
        //   content: content,
        //   imagePath: response.post.imagePath
        // };
        // this.posts.push(post);
        // this.postsUpdated.next({ posts: [...this.posts], postsCount: );
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }

    this.http.put(`http://localhost:3000/posts/${id}`, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ''
        // };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        // this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/posts/${postId}`);
      // .subscribe(() => {
      //   const updatedPosts = this.posts.filter(post => post.id !== postId);
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts]);
      // });
  }
}
