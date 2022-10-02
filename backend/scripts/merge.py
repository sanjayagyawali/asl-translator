import requests
from moviepy.editor import *
from sys import argv

if __name__ == "__main__":
   words = eval(argv[1])
   video_files = []
   for word in words:
      video_files.append(VideoFileClip(word))

   final = concatenate_videoclips(video_files)
   final.write_videofile("../videos/merged-vidtest3.mp4")
