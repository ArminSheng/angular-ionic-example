angular.module('mmr.services')

.factory('mmrUser', ['$rootScope', '$ionicActionSheet', '$cordovaCamera', '$cordovaImagePicker', 'mmrCommonService', 'mmrAuth',
  function($rootScope, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, mmrCommonService, mmrAuth) {

  return {

    changeAvatar: function() {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '新拍摄一张' },
          { text: '从相册中选择一张' }
        ],
        titleText: '修改您的头像',
        cancelText: '取消',
        cancel: function() {

        },
        buttonClicked: function(index) {
          var options;
          switch(index) {
            case 0:
              // invoke the camera
              options = {
                quality: 60,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.PNG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation:true
              };

              $cordovaCamera.getPicture(options).then(mmrAuth.avatar, function(err) {
                // error
                mmrCommonService.help('错误提示', '在调用摄像头时发生了错误');
              });

              break;
            case 1:
              // open the album
              options = {
                maximumImagesCount: 1,
                width: 300,
                height: 300,
                quality: 60
              };

              $cordovaImagePicker.getPictures(options).then(function (results) {
                mmrAuth.avatar(results[0]);
              }, function(error) {
                // error getting photos
                mmrCommonService.help('错误提示', '在调用相册时发生了错误');
              });

              break;
          }

          return true;
        }
      });
    }

  };

}]);
