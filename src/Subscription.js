import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSubscription, gql } from '@apollo/client';
import Card from './components/card';
import CardInfo from './components/cardInfo';
import './styles/subscription.scss';

const Subscription = () => {
  const { data } = useSubscription(
    gql`
      subscription Chunks {
        chunks_with_compression {
          hypertable_name
          chunk_name
          range_start
          range_end
          before_compression_total_bytes
          after_compression_total_bytes
        }
      }
    `
  );

  const [loadModal, setLoadModal] = useState(false);
  const [compressingModal, setCompressingModal] = useState(false);
  const [, setCompressAllComplete] = useState(false);
  const [, setAllChunks] = useState([]);
  const [cardInfo, setCardInfo] = useState({});
  const [biggestChunk, setBiggestChunk] = useState({});
  const [chunks, setChunks] = useState([]);

  const handleBiggestChunk = (chunk) => {
    if (Object.keys(biggestChunk).length === 0) return setBiggestChunk(chunk);
    if (
      biggestChunk.before_compression_total_bytes <
      chunk.before_compression_total_bytes
    )
      return setBiggestChunk(chunk);
    return null;
  };

  const handleCardInfo = (info) => info !== cardInfo && setCardInfo(info);

  const handleCompressingModal = (newState) => setCompressingModal(newState);

  const calculateTotalBytesUncompressed = () =>
    chunks &&
    chunks.reduce((totalBytes, currentChunk) => {
      return totalBytes + currentChunk.before_compression_total_bytes;
    }, 0);

  const svg =
    typeof window !== 'undefined' && document.getElementById('chunks');
  const chunksRect = svg?.getBoundingClientRect();

  useEffect(() => {
    // start up loading screen
    if (data === undefined) {
      setLoadModal(true);
    } else {
      setLoadModal(false);
      setAllChunks(
        data.chunks_with_compression.map((chunk) => chunk.chunk_name)
      );
    }
  }, [chunks]);

  useEffect(() => {
    // check if compression is complete
    const compressionComplete = data?.chunks_with_compression.every(
      (x) => x.after_compression_total_bytes !== null
    );

    if (compressionComplete) {
      setCompressAllComplete(true);
      setLoadModal(false);
    } else {
      setCompressAllComplete(false);
    }
  }, [chunks]);

  useEffect(() => {
    if (data && data.chunks_with_compression) {
      setChunks(data.chunks_with_compression);
      handleCompressingModal(false);
    }
  }, [data]);

  const cardInfoClasses = classNames('ts-compression__inner__info__wrapper', {
    'ts-compression__inner__info__wrapper--active':
      Object.keys(cardInfo).length > 0,
  });

  return (
    <div className="ts-compression">
      <div
        className="ts-compression__loading-screen"
        style={loadModal ? { display: 'block' } : { display: 'none' }}
      >
        <div className="ts-compression__loading-screen__inner">
          <div className="ts-compression__loading-screen__card">
            <h2>Loading...</h2>
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </div>
        </div>
      </div>
      <div className="ts-compression__inner">
        <div className="ts-compression__inner__header">
          <div className="ts-compression__inner__header--logo">
            <svg
              width="255"
              height="67"
              viewBox="0 0 255 67"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0)">
                <path
                  d="M34.2592 66.6122C53.1801 66.6122 68.5185 51.7006 68.5185 33.3061C68.5185 14.9117 53.1801 0 34.2592 0C15.3384 0 0 14.9117 0 33.3061C0 51.7006 15.3384 66.6122 34.2592 66.6122Z"
                  fill="#FFF6E2"
                />
                <path
                  d="M34.2599 55.5907C46.9415 55.5907 57.2221 45.5927 57.2221 33.2596C57.2221 20.9265 46.9415 10.9285 34.2599 10.9285C21.5782 10.9285 11.2977 20.9265 11.2977 33.2596C11.2977 45.5927 21.5782 55.5907 34.2599 55.5907Z"
                  fill="#FDB515"
                />
                <path
                  d="M49.4567 31.065C50.8369 27.7987 49.8319 24.3026 47.2119 23.2563C44.592 22.2099 41.3492 24.0095 39.969 27.2758C38.5887 30.5421 39.5937 34.0382 42.2137 35.0845C44.8336 36.1309 48.0764 34.3313 49.4567 31.065Z"
                  fill="white"
                />
                <path
                  d="M34.3145 60.9422C37.9511 60.9422 40.8991 57.8394 40.8991 54.0119C40.8991 50.1844 37.9511 47.0815 34.3145 47.0815C30.6779 47.0815 27.7299 50.1844 27.7299 54.0119C27.7299 57.8394 30.6779 60.9422 34.3145 60.9422Z"
                  fill="white"
                />
                <path
                  d="M26.5281 35.0806C29.148 34.0343 30.153 30.5382 28.7728 27.2719C27.3926 24.0056 24.1498 22.206 21.5299 23.2524C18.9099 24.2987 17.9049 27.7948 19.2851 31.0611C20.6653 34.3274 23.9081 36.127 26.5281 35.0806Z"
                  fill="white"
                />
                <path
                  d="M45.9322 54.7432C53.0368 51.0408 58.0773 44.0715 58.9174 35.8967L62.8938 40.338C60.6776 49.104 54.309 56.291 45.9402 59.8145C46.0202 59.1145 46.0602 58.3289 46.0602 57.4344C46.0522 56.5321 46.0122 55.6299 45.9322 54.7432ZM26.2503 56.3299C28.7546 57.1544 31.4268 57.5978 34.2191 57.5978C37.1314 57.5978 39.9156 57.1155 42.5159 56.221C41.9718 58.3289 41.1237 60.1723 40.0436 61.6191C38.1635 61.9846 36.2193 62.1791 34.2271 62.1791C32.3549 62.1791 30.5307 62.008 28.7546 61.6891C27.6585 60.2501 26.8024 58.4145 26.2503 56.3299ZM22.642 54.8132C15.4253 51.1108 10.3128 44.0482 9.50475 35.7644L5.62439 40.6725C7.92861 49.3451 14.3052 56.4232 22.642 59.8845C22.562 59.1689 22.522 58.36 22.522 57.4422C22.522 56.5555 22.562 55.6765 22.642 54.8132ZM54.149 19.0725L56.9652 15.1523C54.965 12.8111 52.5888 10.7732 49.9246 9.14754L45.1721 11.7999C48.7244 13.4955 51.8047 16.0079 54.149 19.0725ZM18.8336 8.94531C16.0494 10.6021 13.5611 12.6944 11.4889 15.129L14.6652 18.5902C16.9695 15.7279 19.9297 13.3866 23.3221 11.7688L18.8336 8.94531Z"
                  fill="#141E35"
                />
                <path
                  d="M17.8816 33.2825C17.8816 26.0488 22.8501 19.9429 29.6507 18.0062C29.9548 17.1739 30.3388 16.4505 30.7709 15.8594C22.3541 17.4383 16.0015 24.6409 16.0015 33.2825C16.0015 39.4039 19.1858 44.8019 24.0342 47.991C24.2502 47.3843 24.4823 46.8009 24.7383 46.2331C20.5859 43.3474 17.8816 38.6183 17.8816 33.2825Z"
                  fill="#141E35"
                />
                <path
                  d="M21.1047 27.9627L22.4889 28.3127C23.737 25.5125 26.0012 23.2413 28.8415 21.9579C28.8815 21.4212 28.9375 20.8923 29.0255 20.3867C25.4491 21.7635 22.5849 24.5091 21.1047 27.9627Z"
                  fill="#141E35"
                />
                <path
                  d="M21.6031 35.2507H20.179C20.731 38.9531 22.7792 42.1811 25.7155 44.3279C25.9555 43.9234 26.2035 43.5345 26.4675 43.1611C23.9233 41.2633 22.1391 38.4631 21.6031 35.2507Z"
                  fill="#141E35"
                />
                <path
                  d="M46.0525 28.3588L47.4286 28.0088C45.7804 24.112 42.3561 21.1018 38.1317 19.9429C38.2357 20.4251 38.3237 20.9307 38.3877 21.4596C41.8441 22.5952 44.6283 25.1231 46.0525 28.3588Z"
                  fill="#141E35"
                />
                <path
                  d="M48.5092 31.54L47.021 30.0466L42.1326 30.8089L41.3805 32.9946L43.6287 34.4569L47.7571 32.9946L48.5092 31.54Z"
                  fill="#141E35"
                />
                <path
                  d="M20.2101 31.54L21.6902 30.0466L26.5867 30.8089L27.3308 32.9946L25.0825 34.4569L20.9622 32.9946L20.2101 31.54Z"
                  fill="#141E35"
                />
                <path
                  d="M47.8138 37.4753C48.0458 36.7597 48.2299 36.013 48.3419 35.2507H46.9177C46.8457 35.6785 46.7497 36.0908 46.6377 36.503C47.0537 36.8297 47.4458 37.1486 47.8138 37.4753Z"
                  fill="#141E35"
                />
                <path
                  d="M43.3009 42.0957C42.9328 42.4457 42.5488 42.788 42.1407 43.0913C42.4048 43.4647 42.6608 43.8536 42.9008 44.258C43.5329 43.7836 44.1249 43.2624 44.669 42.6946C44.221 42.5157 43.7649 42.3135 43.3009 42.0957Z"
                  fill="#141E35"
                />
                <path
                  d="M50.6371 33.2834C50.6371 35.3602 50.221 37.3359 49.485 39.1559C50.037 39.7938 50.4531 40.4082 50.7251 40.9605C51.8772 38.6348 52.5252 36.0369 52.5252 33.2834C52.5252 24.1207 45.3886 16.5837 36.2197 15.6348C36.6758 16.187 37.0838 16.8715 37.4198 17.6571C44.9485 19.0883 50.6371 25.5364 50.6371 33.2834Z"
                  fill="#141E35"
                />
                <path
                  d="M46.8844 43.4177C46.0123 44.4444 45.0043 45.37 43.9001 46.1556C44.1562 46.7157 44.3962 47.3068 44.6042 47.9135C46.3164 46.7701 47.8125 45.3389 49.0366 43.7133C48.4206 43.7211 47.6925 43.62 46.8844 43.4177Z"
                  fill="#141E35"
                />
                <path
                  d="M35.8271 31.1128C35.8111 31.1128 35.8031 31.105 35.7951 31.0972L34.2589 15.5098H32.8268L31.5146 31.2061H31.5226C31.5226 31.2372 31.5146 31.2683 31.5146 31.2995C31.5226 31.5639 31.5467 31.8128 31.5947 32.0539C31.6187 32.3184 31.6987 32.5906 31.8267 32.8629C32.0987 33.5473 32.5387 34.0607 33.0588 34.3018C33.1788 34.3952 33.3068 34.4807 33.4348 34.5663C33.4588 34.5818 33.4908 34.5974 33.5148 34.613V34.6207L49.4523 43.1378L50.2844 42.01L35.8271 31.1128Z"
                  fill="#141E35"
                />
                <path
                  d="M37.86 52.4482C36.6199 52.4482 35.5718 51.6237 35.2677 50.5114L41.1643 48.318L39.7562 44.9111L34.2596 47.0735L28.7551 44.9189L27.355 48.318L33.1955 50.5581C32.8755 51.647 31.8434 52.4482 30.6193 52.4482C30.5393 52.4482 30.4513 52.4404 30.3713 52.4326L29.1792 54.0583C29.6272 54.206 30.1072 54.2838 30.6113 54.2838C32.0914 54.2838 33.4036 53.5994 34.2356 52.5337C35.0677 53.5916 36.3798 54.2838 37.86 54.2838C38.42 54.2838 38.9481 54.1827 39.4441 54.0038L38.276 52.4171C38.14 52.4404 38.004 52.4482 37.86 52.4482Z"
                  fill="#141E35"
                />
                <path
                  d="M52.6054 19.8262L50.6933 21.9418C53.0295 25.1387 54.3976 29.0433 54.3976 33.2591C54.3976 40.1661 50.7173 46.2408 45.1567 49.7254C45.4048 50.6433 45.6048 51.6 45.7568 52.5878C52.6054 48.7221 57.2139 41.5117 57.2139 33.2591C57.2299 28.2188 55.5017 23.5675 52.6054 19.8262Z"
                  fill="#141E35"
                />
                <path
                  d="M14.122 33.2604C14.122 29.0524 15.4901 25.1555 17.8183 21.9587L15.9062 19.843C13.0099 23.5765 11.2977 28.2279 11.2977 33.2604C11.2977 41.5674 15.9622 48.8167 22.8908 52.6591C23.0428 51.6713 23.2349 50.7146 23.4829 49.8045C17.8503 46.3277 14.122 40.2218 14.122 33.2604Z"
                  fill="#141E35"
                />
                <path
                  d="M34.2595 10.9285C30.7312 10.9285 27.3869 11.7063 24.4026 13.083L25.8107 15.4787C28.379 14.3197 31.2432 13.6742 34.2595 13.6742C37.2678 13.6742 40.1241 14.3197 42.6923 15.4709L44.1004 13.0752C41.1162 11.7063 37.7799 10.9285 34.2595 10.9285Z"
                  fill="#141E35"
                />
                <path
                  d="M90.3767 47.3535H84.5361V24.3457H76.8794V19.7021H97.9854V24.3457H90.3767V47.3535Z"
                  fill="#141E35"
                />
                <path
                  d="M106.129 22.7281C106.129 24.3459 104.849 25.5904 103.145 25.5904C101.393 25.5904 100.12 24.3459 100.12 22.6892C100.12 20.9858 101.401 19.749 103.145 19.749C104.889 19.749 106.129 20.9858 106.129 22.7281ZM105.825 47.3538H100.409V28.165H105.825V47.3538Z"
                  fill="#141E35"
                />
                <path
                  d="M114.971 27.9939V30.3974C116.211 28.2817 117.867 27.3328 120.387 27.3328C122.947 27.3328 124.82 28.4528 125.764 30.5218C127.084 28.3206 128.916 27.3328 131.732 27.3328C133.732 27.3328 135.397 27.955 136.509 29.114C137.701 30.3974 138.085 31.7274 138.085 34.6287V47.1904H132.668V35.6243C132.668 33.0108 131.684 31.7663 129.644 31.7663C127.636 31.7663 126.492 33.1742 126.492 35.6243V47.1904H121.075V35.7876C121.075 33.1353 120.051 31.7663 118.091 31.7663C116.043 31.7663 114.979 33.1353 114.979 35.7876V47.1904H109.562V27.9939H114.971Z"
                  fill="#141E35"
                />
                <path
                  d="M199.899 45.307C197.635 47.2983 195.291 48.1694 192.307 48.1694C186.29 48.1694 181.858 43.8603 181.858 38.0111C181.858 31.9597 186.21 27.6428 192.347 27.6428C195.291 27.6428 197.723 28.6384 200.235 30.8319L196.611 34.0209C195.419 32.862 194.139 32.3175 192.563 32.3175C189.578 32.3175 187.362 34.6821 187.362 37.8322C187.362 41.1068 189.626 43.4714 192.779 43.4714C194.187 43.4714 195.211 43.0591 196.619 41.8535L199.899 45.307Z"
                  fill="#141E35"
                />
                <path
                  d="M216.74 28.312H222.156V47.5086H216.74V44.8562C214.908 47.1352 212.771 48.1697 209.875 48.1697C204.331 48.1697 200.362 43.985 200.362 38.1359C200.362 32.0844 204.539 27.6509 210.299 27.6509C212.987 27.6509 214.82 28.5609 216.74 30.7621V28.312ZM206.163 38.0503C206.163 41.4105 208.427 43.9384 211.363 43.9384C214.388 43.9384 216.82 41.2005 216.82 37.887C216.82 34.4879 214.604 32.0844 211.403 32.0844C208.339 32.0844 206.163 34.5268 206.163 38.0503Z"
                  fill="#141E35"
                />
                <path
                  d="M225.766 47.688V20.0366H231.182V47.688H225.766Z"
                  fill="#141E35"
                />
                <path
                  d="M161.28 39.3801H145.007C145.239 40.7724 145.871 41.8846 146.887 42.7091C147.911 43.5336 149.207 43.9459 150.791 43.9459C152.687 43.9459 154.311 43.3003 155.672 42.0169L159.944 43.9692C158.88 45.4393 157.608 46.5204 156.12 47.2283C154.631 47.9283 152.871 48.2861 150.831 48.2861C147.663 48.2861 145.087 47.3138 143.094 45.3693C141.102 43.4247 140.11 40.9902 140.11 38.0733C140.11 35.0788 141.102 32.5897 143.086 30.6141C145.071 28.6384 147.559 27.6428 150.559 27.6428C153.735 27.6428 156.328 28.6307 158.32 30.6141C160.312 32.5897 161.304 35.2032 161.304 38.4545L161.28 39.3801ZM156.216 35.4988C155.88 34.4021 155.224 33.5153 154.239 32.8309C153.255 32.1464 152.111 31.8041 150.807 31.8041C149.391 31.8041 148.151 32.1931 147.087 32.9553C146.415 33.4376 145.799 34.2854 145.231 35.4988H156.216Z"
                  fill="#141E35"
                />
                <path
                  d="M254.975 39.5598H238.702C238.934 40.9521 239.566 42.0643 240.582 42.8888C241.606 43.7133 242.902 44.1256 244.486 44.1256C246.382 44.1256 248.006 43.48 249.367 42.1966L253.639 44.1489C252.575 45.619 251.303 46.7001 249.815 47.4079C248.326 48.108 246.566 48.4658 244.526 48.4658C241.358 48.4658 238.782 47.4935 236.789 45.549C234.797 43.6044 233.805 41.1699 233.805 38.253C233.805 35.2584 234.797 32.7694 236.781 30.7938C238.766 28.8181 241.254 27.8225 244.254 27.8225C247.43 27.8225 250.023 28.8103 252.015 30.7938C254.007 32.7694 254.999 35.3829 254.999 38.6342L254.975 39.5598ZM249.911 35.6785C249.575 34.5817 248.919 33.695 247.934 33.0105C246.95 32.3261 245.806 31.9838 244.502 31.9838C243.086 31.9838 241.846 32.3727 240.782 33.135C240.11 33.6172 239.494 34.4651 238.926 35.6785H249.911Z"
                  fill="#141E35"
                />
                <path
                  d="M164.92 41.5436C165.144 41.7147 166.608 42.757 169.288 43.6126C170.44 43.9782 172.144 44.0482 173.441 43.8071C174.073 43.6904 174.753 43.5271 175.265 43.1304C175.489 42.9592 175.681 42.7259 175.761 42.4537C175.889 42.0103 175.697 41.5203 175.369 41.1858C174.929 40.7347 174.281 40.5091 173.673 40.3458C172.32 39.9802 171.048 39.708 169.888 39.4824C168.576 39.2257 167.344 38.9768 166.232 38.409C164.8 37.6701 163.72 36.8534 163.232 35.2589C162.784 33.7966 163.088 31.9454 164.072 30.5686C165.856 28.0718 169.024 27.5118 170.752 27.3951C176.201 27.0451 180.161 30.3431 180.321 30.4831L177.297 33.851L177.305 33.8588C177.281 33.8355 174.577 31.5253 171.144 31.7431C169.136 31.8754 168.368 32.5676 168.136 32.8554C167.928 33.1199 167.8 33.4232 167.824 33.6877C167.872 34.201 168.152 34.7299 170.696 35.2822C172.256 35.6244 173.233 35.8267 174.945 36.3478C178.057 37.289 180.849 39.2568 180.393 42.8348C179.881 46.8094 175.553 48.2873 171.96 48.2873C170.64 48.2873 169.08 48.1006 167.864 47.7117C164.104 46.5139 162.336 45.2694 162.063 45.0671L164.92 41.5436Z"
                  fill="#141E35"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="255" height="66.6122" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="ts-compression__inner__header--title">
            <h2>Compression</h2>
            <p>Interactive visualization</p>
            <span>
              {loadModal
                ? 'Loading chunks...'
                : `Total chunks: ${chunks && chunks.length}`}
            </span>
          </div>
          <div className="ts-compression__inner__header--logo">
            <svg
              height="60"
              viewBox="-200 239 120 60"
              width="120"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m-152.266 259.812h2.7v7.9h3.3v-7.9h2.7v18.5h-2.8v-8.2h-3.2v8.2h-2.7zm14.2 0h2.2l4.1 18.5h-2.7l-.8-4h-3.6l-.8 4h-2.6zm1.1 5.3-1.3 6.7h2.7zm15.2 0h-2.7v-.6c0-.6-.1-1.1-.4-1.6s-.9-.7-1.4-.7c-.3 0-.6.1-.9.2-.2.1-.4.3-.5.5s-.2.5-.3.8-.1.6-.1.9v.9c0 .2.1.4.2.6s.3.4.5.5c.3.2.5.3.8.4l2 .8c.5.2 1 .5 1.4.8s.7.7.9 1.1.3.9.4 1.4c.1.6.1 1.2.1 1.8 0 .7-.1 1.5-.2 2.2-.1.6-.4 1.2-.8 1.7s-.9.9-1.4 1.1c-.7.3-1.4.4-2.2.4-.6 0-1.2-.1-1.8-.3-1.1-.4-1.9-1.3-2.4-2.3-.2-.5-.4-1.1-.4-1.7v-1h2.7v.8c0 .5.1.9.4 1.3.4.4.9.6 1.5.6.4 0 .7 0 1.1-.2.2-.1.4-.3.6-.6.1-.3.2-.6.2-.9v-2.3c0-.3-.1-.5-.2-.8-.1-.2-.3-.4-.5-.5-.3-.1-.5-.3-.8-.4l-1.9-.8c-1-.3-1.8-1-2.3-1.8-.4-.9-.6-1.9-.6-2.9 0-.7.1-1.4.3-2s.5-1.1.9-1.6.9-.8 1.4-1.1c.6-.3 1.3-.4 2-.4.6 0 1.2.1 1.8.4.5.2 1 .6 1.4 1s.7.8.9 1.3.3 1 .3 1.5zm10.7 9.1c0 .6-.1 1.2-.3 1.7a4.32 4.32 0 0 1 -2.3 2.3c-1.1.5-2.3.5-3.3 0-1-.4-1.8-1.3-2.3-2.3-.2-.5-.3-1.1-.3-1.7v-14.4h2.7v14.1c0 .5.1 1.1.5 1.5.7.6 1.7.6 2.3 0 .3-.4.5-.9.5-1.5v-14.1h2.7zm2.6-14.4h4.3c3.1 0 4.7 1.8 4.7 5.4 0 .9-.2 1.9-.5 2.8-.4.8-1 1.5-1.8 1.9l2.9 8.5h-2.8l-2.5-7.9h-1.6v7.9h-2.7zm2.7 8.3h1.5c.4 0 .8-.1 1.1-.2a.9.9 0 0 0 .6-.6c.2-.3.3-.6.3-.9.1-.4.1-.8.1-1.2s0-.8-.1-1.2c0-.3-.2-.6-.3-.9-.2-.3-.4-.4-.7-.6-.4-.1-.8-.2-1.2-.2h-1.4v5.8zm11.5-8.3h2.2l4.1 18.5h-2.6l-.8-4h-3.6l-.8 4h-2.7zm1.1 5.3-1.3 6.7h2.6z"
                fill="#4d4d4d"
              />
              <g transform="matrix(1.61334 0 0 1.61334 96.973766 -163.49731)">
                <circle cx="-169.32" cy="269.642" fill="#ffc627" r="8" />
                <path
                  d="m-166.12 272.042-3-5.9c-.3-.5-.9-.7-1.4-.5-.5.3-.7.9-.5 1.4l1.3 2.4-2.2 2.2a1.09 1.09 0 0 0 0 1.5 1.08 1.08 0 0 0 .7.3c.3 0 .5-.1.7-.3l1.8-1.8.7 1.5c.2.4.6.6.9.6.2 0 .3 0 .5-.1.6-.1.8-.7.5-1.3m4-16.3c-.6.4.4 3.8-2 5.9-1.5-1-3.3-1.6-5.2-1.6s-3.7.6-5.2 1.5c-2.4-2-1.4-5.5-2-5.9-1-.6-2.8 3-2.6 5.2.1 1.2.4 3 1.3 4.4-.7 1.3-1 2.7-1 4.3 0 5.3 4.3 9.6 9.6 9.6s9.6-4.3 9.6-9.6c0-1.5-.4-3-1-4.3.9-1.4 1.2-3.2 1.3-4.4 0-2.2-1.8-5.7-2.8-5.1m-7.2 21.3c-4.1 0-7.4-3.3-7.4-7.5 0-4.1 3.3-7.4 7.4-7.4s7.5 3.3 7.5 7.4c0 4.2-3.4 7.5-7.5 7.5"
                  fill="#232323"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className={cardInfoClasses}>
          <CardInfo {...cardInfo} />
        </div>
        <div className="ts-compression__inner__chunks">
          {compressingModal && (
            <div className="ts-compression__inner__chunks--compressing">
              Compressing chunks
              <div className="dot-flashing"></div>
            </div>
          )}
          <svg
            id="chunks"
            width="90vw"
            height="75vh"
            fill="none"
            className="ts-compression__inner__chunks__cards-wrapper"
            xmlns="http://www.w3.org/2000/svg"
          >
            {chunks.length > 0 &&
              chunks
                .filter((chunk) => chunk.hypertable_name === 'conditions')
                .map((chunk, index) => (
                  <Card
                    {...chunk}
                    screenDimensions={chunksRect}
                    index={index}
                    handleCardInfo={handleCardInfo}
                    biggestChunk={biggestChunk}
                    handleBiggestChunk={handleBiggestChunk}
                    handleCompressingModal={handleCompressingModal}
                    totalChunks={chunks.length}
                    totalBytesUncompressed={calculateTotalBytesUncompressed()}
                    key={index}
                  />
                ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
