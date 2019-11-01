import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  postsCreated: Post[] = [];
  postsSub: Subscription;
  isLoading = false;

  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);

    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postsCount: number }) => {
        setTimeout(() => {
          this.isLoading = false;
          this.postsCreated = postData.posts;
          this.totalPosts = postData.postsCount;
        }, 1000);
      });
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onPageChanged(page: PageEvent) {
    this.isLoading = true;
    this.postPerPage = page.pageSize;
    this.currentPage = page.pageIndex + 1;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
