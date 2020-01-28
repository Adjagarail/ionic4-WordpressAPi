import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.page.html",
  styleUrls: ["./post-detail.page.scss"]
})
export class PostDetailPage implements OnInit {
  data;
  url: string = "http://lataniere.gainde2000.sn/";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public http: HttpClient
  ) {
    let id = this.route.snapshot.paramMap.get("postId");
    this.getPostDetails(id).subscribe(res => {
      this.data = res;
    });
  }

  getPostDetails(id) {
    const route = this.url + "wp-json/wp/v2/" + `posts/${id}?_embed`;
    return this.http.get(route).pipe(
      map(post => {
        post["media_url"] =
          post["_embedded"]["wp:featuredmedia"][0]["media_details"].sizes[
            "medium"
          ].source_url;
        console.log(post);
        return post;
      })
    );
  }

  ngOnInit() {}
}
