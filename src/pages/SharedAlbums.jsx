import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchSharedAlbums } from "../features/album/albumSlice";

export default function SharedAlbums() {
  const dispatch = useDispatch();

  const sharedAlbums = useSelector((state) => state.album.sharedAlbums);
  console.log(sharedAlbums);
  useEffect(() => {
    dispatch(fetchSharedAlbums());
  }, [dispatch]);
  return (
    <>
      <h1>eeheh</h1>
      <h1>eehehhe</h1>
    </>
  );
}
