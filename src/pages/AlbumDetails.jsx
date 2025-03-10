import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchAlbumDetails } from "../features/album/albumSlice";
import { fetchImages } from "../features/imageFeature/imageSlice";

export default function AlbumDetails() {
  const dispatch = useDispatch();
  const { albumId } = useParams();

  const { albumDetails } = useSelector((state) => state.album);
  console.log(albumDetails);

  useEffect(() => {
    dispatch(fetchAlbumDetails(albumId));
  }, [dispatch]);

  const { images } = useSelector((state) => state.image);
  console.log(images);

  useEffect(() => {
    dispatch(fetchImages({ albumId }));
  }, [dispatch]);
  
  return (
    <>
      <h1>details</h1>
      <h1>{albumDetails?.album.name}</h1>
      {images.map((img) => (
        <img src={img.file} className="img-fluid" />
      ))}
    </>
  );
}
