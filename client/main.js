// ---------------------------------------------- importing files ----------------------------------------------------------------------
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import {Meteor} from 'meteor/meteor';
import './main.html';
import {Videos} from '/lib/collection.js';

// var count=0;
Template.navbar.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

if (Meteor.isClient) {
  Meteor.subscribe('files.Videos.all');
}

//window.Videos = Videos;

//---------------------------------------------------------------accounts configuration ------------------------------------------------
Accounts.ui.config({
  passwordSignupFields: "USERNAME_AND_EMAIL"
})


//------------------------------------------------------ routing configuration --------------------------------------------------
Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

//------------------------------------------------------------------ routes -----------------------------------------------------------------
Router.route('/', function () {
  this.render('navbar',{to:"navbar"});
  //this.render('welcome',{to:"addvideo"});
  this.render('welcome',{to:"main"});  
});


Router.route('/videos', function () {
  this.render('navbar',{to:"navbar"});
  // this.render('uploadForm',{to:"addvideo"});
  this.render('videos',{to:"main"});
});

Router.route('/single_video/cdn/storage/Videos/:_id/original/:_id', function () {/*/single_video/cdn/storage/Videos/:_id/original/:_id*/
  this.render('navbar',{to:"navbar"});
  this.render('single_video',
    {to:"addvideo",
      data:function(){
        return Videos.findOne({_id:this.params._id});
      }
  });
  this.render('suggested_videos',{to:"main"});
});



//------------------------------------------------ template.welcome.helpers ----------------------------------------------------------
Template.welcome.helpers({
  username:function(){
    if(Meteor.user())
    {
      return "Hi " + Meteor.user().username;
    }
    else
    {
      return "Please Login";
    }
  }
});

//------------------------------------------------ template.videos.helpers ----------------------------------------------------------

Template.videos.helpers({
  /*video(){
    console.log(Videos.find());
    return Videos.find();
  },*/
  video: function(){
    if(Session.get("userFilter")){
      console.log("function was called");
      return Videos.find({userId:Session.get("userFilter")});
    }
    else{
      return Videos.find({});
    }
  },
  getUser: function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    if(user){
      return user.username;
    }
    else{
      return "unknown";
    }
  },
  filtering_videos: function(){
    if(Session.get("userFilter")){
      return true;
    }
    else {
      return false;
    }
  },
  getFilterUser: function(){
    if(Session.get("userFilter")){
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    }
    else{
      return false;
    }  
  },
  /*averageRating: function() {
    var reviews = Videos.find({_id: Router.current().data()._id}); //get all reviews for productId
    //var ratings = reviews.map(function(player){return player.score;}); // get just the ratings, or use _.pluck
    var ratings = _.pluck(reviews, 'rating'); // get just the ratings i.e. [1, 5, 3, 2, 5]
    var sum = ratings.reduce(function(pv, cv){return pv + cv;}, 0);  //sum ratings i.e. 14
    var avg = sum / ratings.length;  // i.e. 2.8
    return Math.round(avg);  // round avg to ensure only integer values are returned
  },*/
  // video_alt(video_alt){
    // return Meteor.Videos.findOne({video_alt:video_alt});
  // }
});

Template.suggested_videos.helpers({
  /*video(){
    console.log(Videos.find());
    return Videos.find();
  },*/
  video: function(){
    if(Session.get("userFilter")){
      console.log("function was called");
      return Videos.find({userId:Session.get("userFilter")},{sort: {rating: -1}});
    }
    else{
      return Videos.find({},{sort:{rating:-1}});
    }
  },
  getUser: function(user_id){
    var user = Meteor.users.findOne({_id:user_id});
    if(user){
      return user.username;
    }
    else{
      return "unknown";
    }
  },
  filtering_videos: function(){
    if(Session.get("userFilter")){
      return true;
    }
    else {
      return false;
    }
  },
  getFilterUser: function(){
    if(Session.get("userFilter")){
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    }
    else{
      return false;
    }  
  },
  /*averageRating: function() {
    var reviews = Videos.find({_id: Router.current().data()._id}); //get all reviews for productId
    //var ratings = reviews.map(function(player){return player.score;}); // get just the ratings, or use _.pluck
    var ratings = _.pluck(reviews, 'rating'); // get just the ratings i.e. [1, 5, 3, 2, 5]
    var sum = ratings.reduce(function(pv, cv){return pv + cv;}, 0);  //sum ratings i.e. 14
    var avg = sum / ratings.length;  // i.e. 2.8
    return Math.round(avg);  // round avg to ensure only integer values are returned
  },*/
  // video_alt(video_alt){
    // return Meteor.Videos.findOne({video_alt:video_alt});
  // }
});


//------------------------------------------------ template.single_video.helpers ----------------------------------------------------------


Template.single_video.helpers({
  video(){
    console.log(Videos.find());
    return Videos.find();
  },
});



//------------------------------------------------ template.navbar.helpers ----------------------------------------------------------


Template.navbar.helpers({
  
  getFilterUser: function(){
    if(Session.get("userFilter")){
      var user = Meteor.users.findOne({_id:Session.get("userFilter")});
      return user.username;
    }
    else{
      return false;
    }  
  },
  currentUpload:function() {
    return Template.instance().currentUpload.get();
  },
});


//--------------------------------------------------------------- template.video.events ---------------------------------------------------------


Template.videos.events({
  'click .js-onclick': function(event)
  {
    $(event.target).css("width", "50px");
  },

  'click .js-del-video': function(event) {
    var video_id = this._id;
    if(Meteor.user())
    {
      if(this.userId===Meteor.userId())
      { alert("Video deleted");
        Videos.remove({"_id":video_id});
        console.log(video_id);
      }
      else{
        alert("login with same id");
      }
    }
    else
    {
      alert("Login First");
    }
    
    /*$("#"+video_id).hide('slow',function(){*/
      
      
    /*})*/
  },
  'click .js-set-video-filter': function(event){
    console.log(this.meta.created_by);
    Session.set("userFilter",this.meta.created_by);
  },
  'click .js-remove-video-filter': function(){
    Session.set("userFilter",undefined);
  },
  /*'click .js-rate-video':function(event){
    var rating = $(event.currentTarget).data("userrating");
    console.log(rating);
    var video_id = this.data_id;
    console.log(video_id);
    var noofrating = this.no_of_ratings;
    console.log(noofrating);
    var irating = this.rating;
    Meteor.call('videos.update',{video_id,rating,noofrating,irating});
      // Videos.update({_id:video_id},{$set: {rating:rating}});
  },*/
});



Template.suggested_videos.events({
  'click .js-onclick': function(event)
  {
    $(event.target).css("width", "50px");
  },

  'click .js-del-video': function(event) {
    var video_id = this._id;
    if(Meteor.user())
    {
      if(this.userId===Meteor.userId())
      { alert("Video deleted");
        Videos.remove({"_id":video_id});
        console.log(video_id);
      }
      else{
        alert("login with same id");
      }
    }
    else
    {
      alert("Login First");
    }
    
    /*$("#"+video_id).hide('slow',function(){*/
      
      
    /*})*/
  },
  'click .js-set-video-filter': function(event){
    console.log(this.meta.created_by);
    Session.set("userFilter",this.meta.created_by);
  },
  'click .js-remove-video-filter': function(){
    Session.set("userFilter",undefined);
  },
  /*'click .js-rate-video':function(event){
    var rating = $(event.currentTarget).data("userrating");
    console.log(rating);
    var video_id = this.data_id;
    console.log(video_id);
    var noofrating = this.no_of_ratings;
    console.log(noofrating);
    var irating = this.rating;
    Meteor.call('videos.update',{video_id,rating,noofrating,irating});
      // Videos.update({_id:video_id},{$set: {rating:rating}});
  },*/
});



//--------------------------------------------------------------- template.navbar.events ---------------------------------------------------------


Template.navbar.events({
  // 'submit .js-add-video': function(event){
  //   var video_src,video_alt;
  //   video_alt = event.target.video_alt.value;
  //   video_src = event.target.video_src.value;
  //   console.log("video_src is "+video_src+"and video_alt is "+video_alt);
  //   if(Meteor.user()){
  //     Videos.insert(
  //       {
  //         video_src: video_src,
  //         video_alt: video_alt,
  //         created_on: new Date(),
  //         created_by: Meteor.user()._id
  //       }
  //     );
  //   }

  //   return false;
  // },
  'click .js-remove-video-filter': function(){
    Session.set("userFilter",undefined);
  },
  'submit .js-add-video'(e, template) {
    console.log(e);
    console.log("js=js-add-video");
    if (e.currentTarget[0].files && e.currentTarget[0].files[0]) {
      // We upload only one file, in case
      // multiple files were selected
      var video_title = e.target.video_title.value;
      var video_description = e.target.video_description.value;
      const upload = Videos.insert({
        file: e.currentTarget[0].files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic',
        meta:{
          created_on: new Date(),
          created_by: Meteor.user()._id,
          video_title : video_title,
          video_description : video_description,
          // no_of_ratings : 0,
        },  
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert('Error during upload: ' + error);
        } else {
          alert('File "' + fileObj.name + '" successfully uploaded');
        }
        template.currentUpload.set(false);
      });

      upload.start();
    }
    return false;
  },
  'click .js-set-video-filter': function(event){
    console.log(Meteor.userId());
    Session.set("userFilter",Meteor.userId());
  },
});