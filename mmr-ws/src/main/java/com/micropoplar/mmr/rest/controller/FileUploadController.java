package com.micropoplar.mmr.rest.controller;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;

import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/c_upload")
public class FileUploadController {

  @RequestMapping(method = RequestMethod.POST, value = "/upload")
  public String handleFileUpload(@RequestParam("name") String name,
      @RequestParam("file") MultipartFile file) {
    System.out.println(name + " --- File: " + file);
    String result = "successful";
    if (!file.isEmpty()) {
      try {
        BufferedOutputStream stream = new BufferedOutputStream(
            new FileOutputStream(new File("public/user_uploaded/" + name)));
        FileCopyUtils.copy(file.getInputStream(), stream);
        stream.close();
      } catch (Exception e) {
        result = e.getMessage();
      }
    } else {
      result = "failed";
    }

    return result;
  }

}
