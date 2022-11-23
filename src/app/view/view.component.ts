import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../services/certificate.service';
import { BlockchainService } from '../services/blockchain.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  certificate: any;
  hash: string = "";
  revoked: any;
  loaded: Boolean = false;

  constructor(
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private blockchainService: BlockchainService
  ) { 
    this.hash = this.route.snapshot.paramMap.get('hash')!;
    this.certificateService.getOne(this.hash).subscribe({
      next: (result) => {
        this.certificate = result;
        console.log(this.certificate);
      }
    })
    this.blockchainService.revokedStatus(this.hash).then((result: any) => {
      this.revoked = result;
      this.loaded = true;
      console.log(this.revoked);
    })
  }

  ngOnInit(): void {
  }

}
