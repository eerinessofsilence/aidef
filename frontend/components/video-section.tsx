export default function VideoSection() {
  return (
    <section id="video-section" className="border-border border-t">
      <div className="flex justify-center">
        <video
          src="./drone-variant-video.MP4"
          muted
          loop
          autoPlay
          preload="auto"
          controls={false}
          disablePictureInPicture
          className="w-full"
        ></video>
      </div>
    </section>
  );
}
