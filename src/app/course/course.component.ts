import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseId: string = "";
  courseInfo: any;
  courseImage: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private courseService: CourseService
  ) {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.courseService.getOneCourse(this.courseId).subscribe({
      next: (data: any) => {
        this.courseInfo = data;
        console.log(this.courseInfo)
      }
    })
    this.courseService.getCourseImage(this.courseId).subscribe({
      next: (image) => {
        this.courseImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image))
      }
    })
  }

  ngOnInit(): void {
  }

  navigateToExercise() {

  }
}
