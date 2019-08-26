import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  enteredTitle   = '';
  enteredContent = '';
  private mode = 'create';
  private postId: string;
  postToEdit;
  isLoading = false;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.postToEdit = {id: post._id, title: post.title, content: post.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    this.isLoading = true;
    const post = new Post(null, postForm.value.title, postForm.value.content);
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content);
    }
    postForm.resetForm();
    this.router.navigate(['/']);
  }

}
