import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../services/certificate.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  certificate: any;
  hash: string = "";

  constructor(private certificateService: CertificateService, private route: ActivatedRoute) { 
    this.hash = this.route.snapshot.paramMap.get('hash')!;
    this.certificateService.getOne(this.hash).subscribe({
      next: (result) => {
        this.certificate = result;
        console.log(this.certificate);
      }
    })
  }

  ngOnInit(): void {
  }

}
