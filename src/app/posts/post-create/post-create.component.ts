import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post } from 'src/app/shared-classes-and-interfaces/post';
import { PostsService } from 'src/app/services/posts.service';
import { mimeType } from './mime-type.validator';

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
  postToEdit: Post;
  isLoading = false;
  // 01: Using Reactive Forms instead of Template Driven Forms
  form: FormGroup;
  imagePreview;

  constructor(private postsService: PostsService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // 02: Initialization of our Reactive form:
    this.form = new FormGroup({
      title:    new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      image:    new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] }),
      content:  new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        this.postsService.getPost(this.postId).subscribe(post => {
          this.isLoading = false;
          this.postToEdit = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: null
          };
          // 03: setting the values of (the post will edit) into our reactivr form:
          this.form.setValue({
            title: this.postToEdit.title,
            content: this.postToEdit.content,
            imagePath: this.postToEdit.imagePath
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
    // I need to READ the image to DISPLAY it ...
    const reader = new FileReader();
    reader.onload = () => { // when READING image is DONE ..
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image);
    }
    this.form.reset();
    this.router.navigate(['/']);
  }


}
