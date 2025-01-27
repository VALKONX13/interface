// import {faCheckToSlot, faCoins,faEye,faGuitars,faHourglassClock, faMagnifyingGlass,faPeopleGroup, faSpinnerThird} from '@fortawesome/pro-duotone-svg-icons';
// import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import Spinner from 'components/loadingSpinner';
import Modal from 'components/modal';
import AddSongModal from 'components/modal/AddSongModal';
import VoteSongModal from 'components/modal/VoteSongModal';
import RankedView from 'components/rankedView';
import SongCard from 'components/song/SongCard';
import ToggleBox from 'components/toggle';
import { useTopic } from 'hooks/useArena';
import React, { useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToggleWalletModal } from 'state/application/hooks';
import { shortenAddress } from 'utils/index';

// const style = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#EF476F',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;
//
// const monoStyle = {
//   '--fa-primary-color': '#353535',
//   '--fa-secondary-color': '#193154',
//   '--fa-primary-opacity': 1,
//   '--fa-secondary-opacity': 0.4
// } as React.CSSProperties;

const Category = () => {
  const { account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const toggleRef = useRef<any>(null)

  const [voteSongModalOpen, setOpenVoteSongModalOpen] = useState(false);

  function openVoteSongModal() {
    setOpenVoteSongModalOpen(true);
  }

  function closeVoteSongModal() {
    setOpenVoteSongModalOpen(false);
  }

  const [addSongModalOpen, setAddSongModalOpen] = useState(false);

  function openAddSongModal() {
    setAddSongModalOpen(true);
  }

  function closeAddSongModal() {
    setAddSongModalOpen(false);
  }

  const [moreActionModalOpen, setMoreActionModalOpen] = useState(false);

  function openMoreActionModal() {
    setMoreActionModalOpen(true);
  }

  function closeMoreActionModal() {
    setMoreActionModalOpen(false);
  }

  const { id: topicId } = useParams();
  const { choices, loaded } = useTopic(Number(topicId));
  const toggleWalletModal = useToggleWalletModal();

  const renderConnector = () => {
    return active ? (
      <p data-testid="wallet-connect">Wallet Connected {shortenAddress(account)}</p>
    ) : (
      <button data-testid="wallet-connect" className={'bg-primary-light btn-small text-primary font-bold rounded-3xl'} onClick={toggleWalletModal}>
        Connect Wallet
      </button>
    );
  };

  function renderList() {
    return loaded && toggleRef?.current?.selected.name === 'Default view' ? (
      choices.map((song) => {
        return song.meta ? (
          <SongCard key={song.id} songMeta={song.meta} id={song.id} />
        ) : (
          <div className={'bg-squircle w-[311px] h-[316px] bg-cover p-4'} data-testid={`category-list-item-${song.id}`}>
            <Spinner classes='h-full items-center'/>
          </div>
        );
      })
    ) : loaded && toggleRef?.current?.selected.name === 'Ranked view' ? (
      //HARD CODED
      <>
        <RankedView
        openseaLink='#' youtubeLink='#'
        songTitle='Graydient Is Daddy'
        rankPercentage={26}
        songNum={'2.6k'} status={'up'} prevRank={1}
        barPercentage={0} />
        <RankedView
        openseaLink='#' youtubeLink='#'
        songTitle='What About Our Content And Infinite Suffering'
        rankPercentage={24}
        songNum={'2.4k'} status={'down'} prevRank={1}
        barPercentage={25} />
        <RankedView
        openseaLink='#' youtubeLink='#'
        songTitle='Graydient Is Daddy'
        rankPercentage={18}
        songNum={'1.8k'}
        barPercentage={0} />
      </>
    ) : (
      <Spinner />
    );
  }

  // @ts-ignore
  return (
    <div className={'px-24 py-12'}>
      <VoteSongModal closeModal={closeVoteSongModal} open={voteSongModalOpen} />
      <AddSongModal closeModal={closeAddSongModal} open={addSongModalOpen} />
      <Modal
        className={'absolute right-0 overflow-hidden bottom-44 w-64'}
        title={`What do you want to add?`}
        closeModal={closeMoreActionModal}
        open={moreActionModalOpen}
      >
        <main className={'flex flex-wrap gap-6 flex-col items-start mt-4'}>
          <div className='bg-neutral-200 rounded-xl flex w-full items-center px-3 gap-2'>
            <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.5 17.0695C25.5 20.1945 22.9609 22.6945 19.875 22.6945C16.75 22.6945 14.25 20.1945 14.25 17.0695C14.25 13.9835 16.75 11.4445 19.875 11.4445C22.9609 11.4445 25.5 13.9835 25.5 17.0695ZM19.25 14.5695V16.4445H17.375C17.0234 16.4445 16.75 16.757 16.75 17.0695C16.75 17.421 17.0234 17.6945 17.375 17.6945H19.25V19.5695C19.25 19.921 19.5234 20.1945 19.875 20.1945C20.1875 20.1945 20.5 19.921 20.5 19.5695V17.6945H22.375C22.6875 17.6945 23 17.421 23 17.0695C23 16.757 22.6875 16.4445 22.375 16.4445H20.5V14.5695C20.5 14.257 20.1875 13.9445 19.875 13.9445C19.5234 13.9445 19.25 14.257 19.25 14.5695Z" fill="#353535" />
              <path opacity="0.4" d="M3 22.6945C1.59375 22.6945 0.5 21.6007 0.5 20.1945V11.4445C0.5 10.0773 1.59375 8.94446 3 8.94446H18C18.8984 8.94446 19.7188 9.45227 20.1484 10.2335C20.0703 10.2335 19.9531 10.1945 19.875 10.1945C16.0469 10.1945 13 13.2804 13 17.0695C13 19.4132 14.1328 21.4835 15.8906 22.6945H3ZM17.6875 7.69446H3.3125C2.76562 7.69446 2.375 7.30383 2.375 6.75696C2.375 6.24915 2.76562 5.81946 3.3125 5.81946H17.6875C18.1953 5.81946 18.625 6.24915 18.625 6.75696C18.625 7.30383 18.1953 7.69446 17.6875 7.69446ZM15.8125 4.56946H5.1875C4.64062 4.56946 4.25 4.17883 4.25 3.63196C4.25 3.12415 4.64062 2.69446 5.1875 2.69446H15.8125C16.3203 2.69446 16.75 3.12415 16.75 3.63196C16.75 4.17883 16.3203 4.56946 15.8125 4.56946Z" fill="#EC2A64" />
            </svg>
            <button className='py-3 text-start text-base font-semibold text-black'>new category</button>
          </div>
          <div className='bg-neutral-200 rounded-xl flex w-full items-center px-3 gap-2'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.25 16.375C23.25 19.5 20.7109 22 17.625 22C14.5 22 12 19.5 12 16.375C12 13.2891 14.5 10.75 17.625 10.75C20.7109 10.75 23.25 13.2891 23.25 16.375ZM17 13.875V15.75H15.125C14.7734 15.75 14.5 16.0625 14.5 16.375C14.5 16.7266 14.7734 17 15.125 17H17V18.875C17 19.2266 17.2734 19.5 17.625 19.5C17.9375 19.5 18.25 19.2266 18.25 18.875V17H20.125C20.4375 17 20.75 16.7266 20.75 16.375C20.75 16.0625 20.4375 15.75 20.125 15.75H18.25V13.875C18.25 13.5625 17.9375 13.25 17.625 13.25C17.2734 13.25 17 13.5625 17 13.875Z" fill="#353535" />
              <path opacity="0.4" d="M15.75 3.25C17.1172 3.25 18.25 4.38281 18.25 5.75V9.53906C18.0156 9.53906 17.8203 9.5 17.625 9.5C16.8047 9.5 16.0625 9.65625 15.3594 9.89062C14.5 7.46875 12.1953 5.75 9.46094 5.75C6.02344 5.75 3.21094 8.5625 3.21094 12C3.21094 15.4766 6.02344 18.25 9.46094 18.25C9.96875 18.25 10.4766 18.2109 10.9453 18.0938C11.1797 19.1094 11.6484 20.0078 12.3125 20.75H3.25C1.84375 20.75 0.75 19.6562 0.75 18.25V5.75C0.75 4.38281 1.84375 3.25 3.25 3.25H15.75ZM10.7109 12C10.7109 12.7031 10.1641 13.25 9.46094 13.25C8.79688 13.25 8.21094 12.7031 8.21094 12C8.21094 11.3359 8.79688 10.75 9.46094 10.75C10.1641 10.75 10.7109 11.3359 10.7109 12Z" fill="#EC2A64" />
            </svg>
            <button className='py-3 text-start text-base font-semibold text-black' onClick={openAddSongModal} onClickCapture={closeMoreActionModal} >new Song-a-day song</button>
          </div>
        </main>
      </Modal>

      <div className='flex justify-between pb-4'>
        <div className='flex items-center gap-2 relative'>
          <img src='/songDustLogo.png' alt='Logo' />
          <p className='text-black font-semibold text-3xl z-10'>SongDust</p>
          <p className='text-primary-light font-semibold text-3xl absolute left-14 top-2'>SongDust</p>
        </div>
        {renderConnector()}
      </div>
      <header className={'bg-gradient-light w-full h-fit rounded-3xl flex px-8 py-6 mb-12 mt-16 relative'}>
        <div className='max-w-[80%]'>
          <h1>Songs were written in a hotel room</h1>
          <p className={'text-label py-3'}>
            This is the description section of this category called “songs were written in a hotel room”, as the name
            suggests, Jonathan recorded all of the songs here in a hotel room.
          </p>
        </div>
        <img alt="header" src={'/category-header.png'} className='absolute bottom-0 right-0 max-w-[240px]' />
      </header>
      <main className={'flex gap-8'}>
        <section className={'flex-1'}>
          <header className={'mb-8 flex gap-4 justify-between'}>
            <div className='flex w-full justify-between'>
              <Input
                className={'w-104'}
                icon={
                  <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6544 26.2868L20.2574 19.8897C19.4577 21.1158 18.4449 22.1287 17.2721 22.9283L23.6158 29.3254C24.4687 30.125 25.8015 30.125 26.6544 29.3254C27.454 28.4724 27.454 27.1397 26.6544 26.2868Z" fill="#353535" />
                    <path opacity="0.4" d="M11.0349 2.61765C4.95772 2.61765 0 7.62868 0 13.7059C0 19.8364 4.95772 24.7941 11.0349 24.7941C17.1121 24.7941 22.1232 19.8364 22.1232 13.7059C22.1232 7.62868 17.1654 2.61765 11.0349 2.61765ZM11.0349 20.5294C7.25 20.5294 4.2114 17.4908 4.2114 13.7059C4.2114 9.97427 7.25 6.88235 11.0349 6.88235C14.7665 6.88235 17.8585 9.97427 17.8585 13.7059C17.8585 17.4908 14.8199 20.5294 11.0349 20.5294Z" fill="#EC2A64" />
                  </svg>
                }
                placeholder={'Search songs in this category'}
                onUserInput={() => { }}
              ></Input>
              <ToggleBox ref={toggleRef} />
            </div>
          </header>
          <main className={'flex flex-wrap gap-6'}>{renderList()}</main>
        </section>
        <aside className={'w-64'}>
          <button
            onClick={openVoteSongModal}
            className={'btn-primary btn-large w-full mb-2'}
            data-testid="open-vote-modal"
          >
            Vote for a Song!
          </button>
          <section
            className={'days-left rounded-2xl bg-primary-light-2 flex gap-4 py-3 justify-center items-center mt-6 mb-4'}
          >
            {/*<div><FontAwesomeIcon fontSize={36} icon={faHourglassClock} style={style} /></div>*/}
            <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 23.5938C18 18.6562 22 14.5938 27 14.5938C31.9375 14.5938 36 18.6562 36 23.5938C36 28.5938 31.9375 32.5938 27 32.5938C22 32.5938 18 28.5938 18 23.5938ZM27.9375 19.5938C27.9375 19.0938 27.5 18.5938 26.9375 18.5938C26.4375 18.5938 25.9375 19.0938 25.9375 19.5938V23.5938C25.9375 24.1562 26.4375 24.5938 26.9375 24.5938H30C30.5 24.5938 31 24.1562 31 23.5938C31 23.0938 30.5 22.5938 30 22.5938H27.9375V19.5938Z" fill="#565656" />
              <path opacity="0.5" d="M0 2.59375C0 1.53125 0.875 0.59375 2 0.59375H22C23.0625 0.59375 24 1.53125 24 2.59375C24 3.71875 23.0625 4.59375 22 4.59375V5.28125C22 7.96875 20.9375 10.5312 19.0625 12.4062L14.8125 16.5938L17.0625 18.8438C16.375 20.2812 16 21.9062 16 23.5938C16 27.3438 17.8125 30.6562 20.625 32.5938H2C0.875 32.5938 0 31.7188 0 30.5938C0 29.5312 0.875 28.5938 2 28.5938V27.9062C2 25.2812 3 22.7188 4.875 20.8438L9.125 16.5938L4.875 12.4062C3 10.5312 2 7.96875 2 5.28125V4.59375C0.875 4.59375 0 3.71875 0 2.59375ZM6 4.59375V5.28125C6 6.46875 6.3125 7.65625 6.9375 8.59375H17C17.625 7.65625 18 6.46875 18 5.28125V4.59375H6Z" fill="#EC2A64" />
            </svg>
            <div>
              <div className='flex gap-2 items-center'>
                <h2 className={'font-bold'}>24 Days</h2>
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M8 0.5C3.5625 0.5 0 4.09375 0 8.5C0 12.9375 3.5625 16.5 8 16.5C12.4062 16.5 16 12.9375 16 8.5C16 4.09375 12.4062 0.5 8 0.5ZM8 13C7.4375 13 7 12.5625 7 12C7 11.4375 7.40625 11 8 11C8.53125 11 9 11.4375 9 12C9 12.5625 8.53125 13 8 13ZM10.1562 8.5625L8.75 9.4375V9.5C8.75 9.90625 8.40625 10.25 8 10.25C7.59375 10.25 7.25 9.90625 7.25 9.5V9C7.25 8.75 7.375 8.5 7.625 8.34375L9.40625 7.28125C9.625 7.15625 9.75 6.9375 9.75 6.6875C9.75 6.3125 9.40625 6 9.03125 6H7.4375C7.03125 6 6.75 6.3125 6.75 6.6875C6.75 7.09375 6.40625 7.4375 6 7.4375C5.59375 7.4375 5.25 7.09375 5.25 6.6875C5.25 5.46875 6.21875 4.5 7.40625 4.5H9C10.2812 4.5 11.25 5.46875 11.25 6.6875C11.25 7.4375 10.8438 8.15625 10.1562 8.5625Z" fill="#193154" />
                </svg>
              </div>
              <p className={'font-semibold'}>Left untill the snapshot</p>
            </div>
          </section>
          <section className={'category-info rounded-2xl bg-primary-light-2 flex flex-col gap-6 px-6 pt-6 mb-4 pb-7'}>
            <div className={'flex gap-3 flex-col'}>
              <label className={'font-semibold'}>Category&apos;s General Stats</label>
              <div className={'rounded-xl bg-g1 flex gap-4 py-4 px-5 justify-between items-center'}>
                {/*<div><FontAwesomeIcon fontSize={42} icon={faCheckToSlot} style={monoStyle} /></div>*/}
                <svg width="46" height="40" viewBox="0 0 46 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M41.75 22.5H38V28.75H39.25C39.875 28.75 40.5 29.375 40.5 30C40.5 30.7031 39.875 31.25 39.25 31.25H6.75C6.04688 31.25 5.5 30.7031 5.5 30C5.5 29.375 6.04688 28.75 6.75 28.75H8V22.5H4.25C2.14062 22.5 0.5 24.2188 0.5 26.25V33.75C0.5 35.8594 2.14062 37.5 4.25 37.5H41.75C43.7812 37.5 45.5 35.8594 45.5 33.75V26.25C45.5 24.2188 43.7812 22.5 41.75 22.5ZM20.5 22.1094C20.8125 22.3438 21.2812 22.5 21.6719 22.5C21.6719 22.5 21.75 22.5 21.8281 22.4219C22.375 22.4219 22.7656 22.1875 23.1562 21.7188L30.0312 12.9688C30.6562 12.1875 30.5 11.0156 29.6406 10.3906C28.8594 9.76562 27.6875 9.84375 27.0625 10.7031L21.4375 17.9688L18.5469 15.4688C17.7656 14.8438 16.5938 14.9219 15.8906 15.7031C15.2656 16.4844 15.3438 17.6562 16.125 18.3594L20.5 22.1094Z" fill="#353535" />
                  <path opacity="0.4" d="M34.25 2.5H11.75C9.64062 2.5 8 4.21875 8 6.25V31.25H38V6.25C38 4.21875 36.2812 2.5 34.25 2.5ZM30.0312 13.0469L23.1562 21.7969C22.8438 22.1875 22.375 22.5 21.9062 22.5C21.8281 22.5 21.75 22.5 21.6719 22.5C21.2031 22.5 20.7344 22.3438 20.4219 22.0312L16.0469 18.2812C15.3438 17.6562 15.2656 16.4844 15.8906 15.7031C16.5938 14.9219 17.7656 14.8438 18.5469 15.4688L21.4375 17.9688L27.1406 10.7812C27.7656 9.92188 28.9375 9.76562 29.7188 10.4688C30.5781 11.0938 30.7344 12.2656 30.0312 13.0469Z" fill="#193154" />
                </svg>
                <div className={''}>
                  <h1 className={'font-bold'}>2.25k</h1>
                  <p className={'font-semibold relative -mt-2'}>SONG casted</p>
                </div>
              </div>
              <section className={'flex gap-4'}>
                <div className={'rounded-xl bg-yellowC flex flex-col justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faPeopleGroup} style={monoStyle} />*/}
                  <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4.5C18 6.1875 16.6406 7.5 15 7.5C13.3125 7.5 12 6.1875 12 4.5C12 2.85938 13.3125 1.5 15 1.5C16.6406 1.5 18 2.85938 18 4.5ZM18 21C18 21.8438 17.2969 22.5 16.5 22.5H13.5C12.6562 22.5 12 21.8438 12 21V19.0312C10.2188 18.1875 9 16.3594 9 14.25C9 11.3906 11.3438 9 14.25 9H15.75C18.6094 9 21 11.3906 21 14.25C21 16.3594 19.7344 18.1875 18 19.0312V21ZM12 12.2812C11.5312 12.7969 11.25 13.5 11.25 14.25C11.25 15.0469 11.5312 15.75 12 16.2656V12.2812ZM18.75 14.25C18.75 13.5 18.4219 12.7969 18 12.2812V16.2656C18.4219 15.7031 18.75 15.0469 18.75 14.25Z" fill="#353535" />
                    <path opacity="0.4" d="M3 4.5C3 2.85938 4.3125 1.5 6 1.5C7.64062 1.5 9 2.85938 9 4.5C9 6.1875 7.64062 7.5 6 7.5C4.3125 7.5 3 6.1875 3 4.5ZM9 18.5156V21C9 21.8438 8.29688 22.5 7.5 22.5H4.5C3.65625 22.5 3 21.8438 3 21V19.0312C1.21875 18.1875 0 16.3594 0 14.25C0 11.3906 2.34375 9 5.25 9H6.75C7.64062 9 8.53125 9.28125 9.28125 9.70312C8.15625 10.875 7.5 12.5156 7.5 14.25C7.5 15.8906 8.01562 17.3438 9 18.5156ZM3 16.2656V12.2812C2.53125 12.7969 2.25 13.5 2.25 14.25C2.25 15.0469 2.53125 15.75 3 16.2656ZM21 18.5156C21.9375 17.3438 22.5 15.8906 22.5 14.25C22.5 12.5156 21.7969 10.875 20.6719 9.70312C21.4219 9.28125 22.3125 9 23.25 9H24.75C27.6094 9 30 11.3906 30 14.25C30 16.3594 28.7344 18.1875 27 19.0312V21C27 21.8438 26.2969 22.5 25.5 22.5H22.5C21.6562 22.5 21 21.8438 21 21V18.5156ZM27.75 14.25C27.75 13.5 27.4219 12.7969 27 12.2812V16.2656C27.4219 15.7031 27.75 15.0469 27.75 14.25ZM21 4.5C21 2.85938 22.3125 1.5 24 1.5C25.6406 1.5 27 2.85938 27 4.5C27 6.1875 25.6406 7.5 24 7.5C22.3125 7.5 21 6.1875 21 4.5Z" fill="#193154" />
                  </svg>
                  <h2 className={'font-bold'}>3</h2>
                  <p className={'font-normal text-sm'}>Participants</p>
                </div>
                <div className={'rounded-xl bg-greenC flex-col flex justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faSpinnerThird} style={monoStyle} />*/}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 1.5C10.5 0.703125 11.1562 0 12 0C18.6094 0 24 5.39062 24 12C24 14.2031 23.3906 16.2656 22.3594 18C21.9375 18.75 21.0469 18.9844 20.2969 18.5625C19.5938 18.1406 19.3594 17.25 19.7812 16.5C20.5312 15.1875 21 13.6406 21 12C21 7.03125 16.9688 3 12 3C11.1562 3 10.5 2.34375 10.5 1.5Z" fill="#353535" />
                    <path opacity="0.4" d="M11.9531 3C6.98438 3 2.95312 7.03125 2.95312 12C2.95312 16.9688 6.98438 21 11.9531 21C15.2812 21 18.1406 19.2656 19.6875 16.6406H19.7344C19.4062 17.3438 19.6406 18.1875 20.2969 18.5625C21.0469 18.9844 21.9375 18.75 22.3594 18H22.4062C20.3438 21.6094 16.4531 24 12 24C5.34375 24 0 18.6562 0 12C0 5.39062 5.34375 0 12 0C11.1562 0 10.5 0.703125 10.5 1.5C10.5 2.34375 11.1562 3 12 3H11.9531Z" fill="#193154" />
                  </svg>
                  <h2 className={'font-bold'}>32/50</h2>
                  <p className={'font-normal text-sm'}>Cycles past</p>
                </div>
              </section>
            </div>
            <div className={'flex gap-3 flex-col'}>
              <label className={'font-semibold'}>Your stats in this category</label>
              <div className={'rounded-xl bg-g1 flex gap-4 py-4 px-5 justify-between items-center'}>
                {/*<div><FontAwesomeIcon fontSize={42} icon={faCoins} style={monoStyle} /></div>*/}
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 18.75C30 20.1562 28.8281 21.4844 26.9531 22.5C24.2188 24.0625 19.8438 25 15 25C10.3125 25 6.17188 24.1406 3.35938 22.7344C3.20312 22.6562 3.125 22.5781 2.96875 22.5C1.09375 21.4844 0 20.1562 0 18.75C0 15.3125 6.64062 12.5 15 12.5C23.2812 12.5 30 15.3125 30 18.75ZM15 27.5C19.375 27.5 23.4375 26.7969 26.5625 25.5469C27.8125 25 28.9844 24.2969 30 23.5156V26.25C30 27.6562 28.8281 28.9844 26.9531 30C26.7969 30.0781 26.7188 30.1562 26.5625 30.2344C23.75 31.6406 19.6094 32.5 15 32.5C10.0781 32.5 5.70312 31.5625 2.96875 30C1.09375 28.9844 0 27.6562 0 26.25V23.5156C0.9375 24.2969 2.10938 25 3.35938 25.5469C6.48438 26.7969 10.5469 27.5 15 27.5ZM30 31.0156V33.75C30 37.2656 23.2812 40 15 40C6.64062 40 0 37.2656 0 33.75V31.0156C0.9375 31.7969 2.10938 32.5 3.35938 33.0469C6.48438 34.2969 10.5469 35 15 35C19.375 35 23.4375 34.2969 26.5625 33.0469C27.8125 32.5 28.9844 31.7969 30 31.0156Z" fill="#353535" />
                  <path opacity="0.4" d="M40 6.25C40 7.73438 38.8281 8.98438 36.9531 10C34.6875 11.3281 31.3281 12.1875 27.4219 12.4219C27.1094 12.3438 26.7969 12.1875 26.5625 12.0312C23.4375 10.7812 19.375 10 15 10C14.2969 10 13.6719 10.0781 13.0469 10.0781C13.0469 10.0781 12.9688 10.0781 12.9688 10C11.0938 8.98438 10 7.73438 10 6.25C10 2.8125 16.6406 0 25 0C33.2812 0 40 2.8125 40 6.25ZM32.5 21.7969C33.9062 21.4062 35.3125 21.0156 36.5625 20.5469C37.8125 20 38.9844 19.2969 40 18.5156V21.25C40 23.5938 36.9531 25.625 32.5 26.7188V21.7969ZM32.5 18.75C32.5 17.1094 31.6406 15.7031 30.5469 14.6094C32.8125 14.2969 34.8438 13.75 36.5625 13.0469C37.8125 12.5 38.9844 11.7969 40 11.0156V13.75C40 15.1562 38.8281 16.4844 36.9531 17.5C36.7969 17.5781 36.7188 17.6562 36.5625 17.7344C35.3906 18.3594 33.9844 18.8281 32.5 19.2188V18.75Z" fill="#193154" />
                </svg>
                <div className={''}>
                  <h1 className={'font-bold'}>2.73</h1>
                  <p className={'font-semibold relative -mt-2'}>SONG earned</p>
                </div>
              </div>
              <section className={'flex gap-4'}>
                <div className={'rounded-xl bg-yellowC flex flex-col justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faGuitars} style={monoStyle} />*/}
                  <svg width="44" height="26" viewBox="0 0 44 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 16.5156C6.90625 16.4219 6.625 16.3281 6.4375 16.5156L5.92188 17.0312C5.82812 17.125 5.73438 17.3594 5.92188 17.5938L8.40625 20.0312C8.54688 20.1719 8.78125 20.1719 8.92188 20.0312L9.4375 19.5156C9.53125 19.4219 9.625 19.1875 9.4375 19L7 16.5156ZM24.9531 2.875C24.7656 1.98438 24.0625 1.28125 23.1719 1.09375C22.0938 0.90625 22.0938 1.04688 18.1562 3.57812C17.7344 3.85938 17.4531 4.32812 17.4531 4.84375V6.4375L12.3906 11.5L14.5 13.6094L22.6094 5.54688C22.6562 5.54688 22.7031 5.54688 22.7031 5.54688C23.4062 5.54688 24.0156 5.26562 24.4375 4.75C24.9062 4.23438 25.0469 3.53125 24.9531 2.875ZM10 13.5156C9.90625 13.4219 9.625 13.3281 9.4375 13.5156L8.96875 14.0312C8.875 14.125 8.78125 14.3594 8.96875 14.5469L11.4531 17.0312C11.5938 17.1719 11.8281 17.1719 11.9688 17.0312L12.4844 16.5156C12.5781 16.4219 12.6719 16.1875 12.4844 15.9531L10 13.5156Z" fill="#353535" />
                    <path opacity="0.4" d="M12.3906 11.5C12.0625 10.9375 11.9688 10.2812 12.25 9.67188L13.0469 7.9375C13.2344 7.5625 13.1406 7.09375 12.7656 6.85938C12.4375 6.625 11.9219 6.625 11.6406 6.95312L9.85938 8.73438C9.4375 9.10938 9.15625 9.53125 8.96875 10.0938C8.64062 11.0312 7.98438 11.7812 7.09375 12.1562L3.48438 13.8438C0.8125 14.9219 0.109375 18.3906 2.17188 20.4062L5.59375 23.8281C7.65625 25.8906 11.0781 25.1875 12.1562 22.5156L13.8438 18.9062C14.2656 18.0625 15.0156 17.3594 15.9062 17.0312C16.4219 16.8438 16.8906 16.5625 17.2656 16.1406L18.2969 15.1562C18.5781 14.8281 18.625 14.3594 18.3906 13.9844C18.1562 13.6562 17.6875 13.4688 17.3125 13.6094L16.2344 13.9375C15.625 14.125 14.9688 14.0312 14.5 13.6094L12.3906 11.5ZM9.48438 19.5156L8.96875 20.0312C8.82812 20.1719 8.59375 20.1719 8.40625 20.0312L5.96875 17.5938C5.78125 17.3594 5.875 17.125 5.96875 17.0312L6.48438 16.5156C6.67188 16.3281 6.90625 16.4219 7 16.5156L9.48438 19C9.67188 19.1875 9.57812 19.4219 9.48438 19.5156ZM12.4844 16.5156L11.9688 17.0312C11.8281 17.1719 11.5938 17.1719 11.4062 17.0312L8.96875 14.5469C8.78125 14.3594 8.875 14.125 8.96875 14.0312L9.48438 13.5156C9.67188 13.3281 9.90625 13.4219 10.0469 13.5156L12.4844 15.9531C12.6719 16.1875 12.5781 16.4219 12.4844 16.5156Z" fill="#193154" />
                    <path d="M36.8594 3.67188L39.0156 1.46875C39.625 0.859375 40.5625 0.859375 41.1719 1.46875L42.5312 2.875C43.1406 3.4375 43.1406 4.375 42.5312 4.98438L40.3281 7.14062C40.1875 7.32812 39.9531 7.46875 39.7188 7.5625L37.9844 8.125L32.8281 13.2812C32.5469 13.5625 32.0781 13.5625 31.75 13.2812L30.7188 12.25C30.3906 11.9219 30.3906 11.4531 30.7188 11.1719L35.875 5.96875L36.4375 4.28125C36.5312 4.04688 36.6719 3.8125 36.8594 3.67188Z" fill="#353535" />
                    <path opacity="0.4" d="M35.3125 13.5625C35.1719 12.8594 34.8438 12.25 34.4219 11.6875L32.8281 13.2812C32.5469 13.5625 32.0781 13.5625 31.75 13.2812L30.7188 12.25C30.3906 11.9219 30.3906 11.4531 30.7188 11.1719L32.3125 9.57812C31.75 9.15625 31.1406 8.82812 30.4375 8.6875C28.8906 8.3125 27.2969 8.64062 26.2188 9.71875C25.7969 10.1406 25.4688 10.6562 25.2812 11.2656C25 12.1562 24.2031 12.8125 23.3125 12.8594C22.1875 13 21.1562 13.4219 20.3594 14.2188C18.2031 16.3281 18.625 20.1719 21.2031 22.7969C23.8281 25.375 27.6719 25.7969 29.7812 23.6406C30.5312 22.8438 31 21.8125 31.1406 20.6875C31.1875 19.8438 31.8438 19 32.7344 18.7188C33.3438 18.5312 33.8594 18.2031 34.2812 17.7812C35.3594 16.7031 35.6875 15.1094 35.3125 13.5625ZM28.75 17.5C27.4844 17.5469 26.5 16.5156 26.5 15.25C26.5 14.0312 27.4844 13 28.75 13C29.9688 13 31 14.0312 30.9531 15.25C31 16.5156 29.9688 17.5 28.75 17.5Z" fill="#193154" />
                  </svg>
                  <h2 className={'font-bold'}>3</h2>
                  <p className={'font-normal text-sm'}>Song voted</p>
                </div>
                <div className={'rounded-xl bg-greenC flex-col flex justify-center items-center w-24 h-24'}>
                  {/*<FontAwesomeIcon fontSize={24} icon={faCheckToSlot} style={monoStyle} />*/}
                  <svg width="28" height="24" viewBox="0 0 28 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.25 13.5H23V17.25H23.75C24.125 17.25 24.5 17.625 24.5 18C24.5 18.4219 24.125 18.75 23.75 18.75H4.25C3.82812 18.75 3.5 18.4219 3.5 18C3.5 17.625 3.82812 17.25 4.25 17.25H5V13.5H2.75C1.48438 13.5 0.5 14.5312 0.5 15.75V20.25C0.5 21.5156 1.48438 22.5 2.75 22.5H25.25C26.4688 22.5 27.5 21.5156 27.5 20.25V15.75C27.5 14.5312 26.4688 13.5 25.25 13.5ZM12.5 13.2656C12.6875 13.4062 12.9688 13.5 13.2031 13.5C13.2031 13.5 13.25 13.5 13.2969 13.4531C13.625 13.4531 13.8594 13.3125 14.0938 13.0312L18.2188 7.78125C18.5938 7.3125 18.5 6.60938 17.9844 6.23438C17.5156 5.85938 16.8125 5.90625 16.4375 6.42188L13.0625 10.7812L11.3281 9.28125C10.8594 8.90625 10.1562 8.95312 9.73438 9.42188C9.35938 9.89062 9.40625 10.5938 9.875 11.0156L12.5 13.2656Z" fill="#353535" />
                    <path opacity="0.4" d="M20.75 1.5H7.25C5.98438 1.5 5 2.53125 5 3.75V18.75H23V3.75C23 2.53125 21.9688 1.5 20.75 1.5ZM18.2188 7.82812L14.0938 13.0781C13.9062 13.3125 13.625 13.5 13.3438 13.5C13.2969 13.5 13.25 13.5 13.2031 13.5C12.9219 13.5 12.6406 13.4062 12.4531 13.2188L9.82812 10.9688C9.40625 10.5938 9.35938 9.89062 9.73438 9.42188C10.1562 8.95312 10.8594 8.90625 11.3281 9.28125L13.0625 10.7812L16.4844 6.46875C16.8594 5.95312 17.5625 5.85938 18.0312 6.28125C18.5469 6.65625 18.6406 7.35938 18.2188 7.82812Z" fill="#193154" />
                  </svg>
                  <h2 className={'font-bold'}>240</h2>
                  <p className={'font-normal text-sm'}>SONG casted</p>
                </div>
              </section>
            </div>
          </section>
          <button onClick={openMoreActionModal} className={'btn-primary-inverted btn-large w-full'}>
            More Actions
          </button>
          <section>
            <div className={'time-left'}></div>
            <div className={'info-summery'}></div>
          </section>
        </aside>
      </main>
      {/*<button className={'btn-primary-inverted'}>Hello Songdust!</button>*/}
    </div>
  );
};

export default Category; /* Rectangle 18 */
