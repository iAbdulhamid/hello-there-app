import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  enteredTitle   = '';
  enteredContent = '';
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(private postsService: PostsService) { }

  ngOnInit() {
  }

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    const post = new Post(postForm.value.title, postForm.value.content);
    // this.postCreated.emit(post);
    this.postsService.addPost(post);
    postForm.resetForm();
  }

}
