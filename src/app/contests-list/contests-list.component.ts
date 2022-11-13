import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contests-list',
  templateUrl: './contests-list.component.html',
  styleUrls: ['./contests-list.component.css']
})
export class ContestsListComponent implements OnInit {

  contests: Array<any> = [];
  contestAddress: string = "";
  rewardAddress: string = "";
  loaded: Boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  createContest() {

  }

  navigateToContest(contestAddress: string) {

  }

}
