import {mongo} from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
//export const Videos = new Mongo.Collection("videos");
//const Videos = new FilesCollection({collectionName: 'Videos'});
//export default Videos;



export const  Videos = new FilesCollection({
  collectionName: 'Videos',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (/mp4/i.test(file.extension)) {
      return true;
    }
    return 'Please upload video';
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.Videos.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.Videos.all', function () {
    return Videos.find().cursor;
  });
}


/*Meteor.methods({
	Videos.update(taskId,{$set:{checked:setChecked}});
});*/

/*Videos.allow({
	update(userId, doc){
		return true;
	}
});
*/


//------------------------------------------------------------set up security on Videos collection------------------------------------------
/*Videos.allow({
	insert:function(userId, doc){
		if(Meteor.user()){//are they logged in?
			console.log(doc);//show details in server of the image inserted
			if(doc.created_by != userId){
				return false;
			}
			else{
				return true;
			}
		}
		else{
			return false;
		}
	},
	remove: function(userId, doc){
		if(Meteor.user()){//are they logged in?
			return true;
		}
		else{
			return false;
		}
	}
});*/