import requests
from moviepy.editor import *
from sys import argv

if __name__ == "__main__":
   words = eval(argv[1])
   video_files = []
   for word in words:
      video_files.append(VideoFileClip(word))
      # Add text to clip
      word_txt = word.split("/")[2].split(".")[0]
      text_clip = TextClip(word_txt, fontsize = 50, color = 'white', stroke_color = 'black', stroke_width = 2)
      text_clip = text_clip.set_pos('bottom').set_duration(2)
      video_files[-1] = CompositeVideoClip([video_files[-1], text_clip]) 
      
   final = concatenate_videoclips(video_files)
   final.write_videofile("../videos/merged.mp4")

