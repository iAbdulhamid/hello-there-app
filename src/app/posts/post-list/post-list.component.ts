import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  // @Input() postsFromAppComponent: Post[] = [];
  postsCreated: Post[] = [];
  postsSub: Subscription;
  isLoading = false;

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe(posts => {
        setTimeout(() => {
          this.isLoading = false;
          this.postsCreated = posts;
        }, 1000);
      });
  }

  onDeletePost(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}