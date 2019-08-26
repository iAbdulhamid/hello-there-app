import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
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
  // 01: Using Reactive Forms instead of Template Driven Forms
  form: FormGroup;

  constructor(private postsService: PostsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // 02: Initialization of our Reactive form:
    this.form = new FormGroup({
      title:   new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image:   new FormControl(null),
      content: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.postToEdit = {id: post._id, title: post.title, content: post.content};
          // 03: setting the values of (the post will edit) into our reactivr form:
          this.form.setValue({
            title: this.postToEdit.title,
            content: this.postToEdit.content
          });
        });

      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    // Note: setValue(..for all input controls..) patchValue(..for specific control..)
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    const post = new Post(null, this.form.value.title, this.form.value.content);
    if (this.mode === 'create') {
      this.postsService.addPost(post);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content);
    }
    this.form.reset();
    this.router.navigate(['/']);
  }


}
