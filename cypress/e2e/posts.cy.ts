describe("Post Management Tests", () => {
  before(() => {
    // Login before running the tests
    cy.login("testuser@gmail.com", "testuser").then((response: any) => {
      cy.wrap({
        authToken: response.body.token,
        authUser: response.body.user,
      }).as("authData");
    });
  });

  it("should create a new post, add it to posts, view it, update it and comment on it", () => {
    cy.get("@authData").then((data: any) => {
      const authToken = data.authToken;

      // create post
      cy.request({
        method: "POST",
        url: "/posts",
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          title: "Post 1",
          content: "content 1",
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property(
          "message",
          "post created successfully"
        );
        expect(response.body).to.have.property("createdPost");
        cy.wrap(response.body.createdPost).as("createdPost");
      });

      // verify the created post in the list
      cy.get("@createdPost").then((createdPost: any) => {
        cy.request({
          url: "/posts",
          method: "GET",
        }).then((response) => {
          expect(response.status).to.eq(200);
          const postId = createdPost.id;
          const postExists = response.body.posts.some(
            (post: any) => post.id === postId
          );
          expect(postExists).to.be.true;
        });

        // view the created post
        cy.request({
          url: `/posts/${createdPost.id}`,
          method: "GET",
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property("post");
          expect(response.body.post).to.have.property(
            "title",
            createdPost.title
          );
          // Add more assertions for other properties if needed
          cy.wrap(response.body.post).as("viewedPost");
        });

        //update the created post
        cy.get("@createdPost").then((createdPost: any) => {
          cy.request({
            method: "PUT",
            url: `/posts/${createdPost.id}`,
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
              title: "Post 1 edited",
              content: "content 1 edited",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property(
              "message",
              "post updated successfully"
            );
            expect(response.body).to.have.property("updatedPost");
            expect(response.body.updatedPost).to.have.property(
              "id",
              createdPost.id
            );
            expect(response.body.updatedPost).to.have.property(
              "title",
              "Post 1 edited"
            );
          });
        });

        // make a comment on created post
        cy.get("@viewedPost").then((viewedPost: any) => {
          // make a comment
          cy.request({
            method: "POST",
            url: `/posts/${viewedPost.id}/comment`,
            headers: { Authorization: `Bearer ${authToken}` },
            body: {
              comment: "comment 1",
            },
          }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property("createdComment");
            expect(response.body.createdComment).to.have.property(
              "content",
              "comment 1"
            );
            cy.wrap(response.body.createdComment).as("createdComment");
          });

          // view created comment among the post comments
          cy.request({
            url: `/posts/${viewedPost.id}`,
            method: "GET",
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("post");

            cy.get("@createdComment").then((comment: any) => {
              const postComments = response.body.post.comments;
              const commentExists = postComments.some(
                (postComment: any) => postComment.id === comment.id
              );
              expect(commentExists).to.be.true;
            });
          });

          //search the post
          cy.request({
            url: "/posts/search",
            method: "POST",
            body: {
              searchKey: "cont",
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("searchedPosts");
            const { searchedPosts } = response.body;
            expect(searchedPosts.length).to.eq(1);
          });
        });
      });
    });
  });
});
