// import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';
import { useWeb3React } from '@web3-react/core';
import Input from 'components/basic/input';
import Modal, { ModalPropsInterface } from 'components/modal/index';
import { ARENA_ADDRESS } from 'constants/addresses';
import { SONG } from 'constants/tokens';
import { useVoteCallback } from 'hooks/arena/useVoteCallback';
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback';
import { useTopic } from 'hooks/useArena';
import { useTokenBalance } from 'hooks/useCurrencyBalance';
import useWalletActivation from 'hooks/useWalletActivation';
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatBalance } from 'utils/numbers';

const VoteSongModal = (props: ModalPropsInterface) => {
  const { chainId, account } = useWeb3React();
  const active = useMemo(() => !!account, [account]);
  const { tryActivation } = useWalletActivation();

  const { id: topicId } = useParams();
  const { choices, loaded } = useTopic(Number(topicId));

  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const selectedSong = useMemo(() => {
    if (selectedSongId === null) return null;
    return choices.find((c: { id: number }) => c.id === selectedSongId)!;
  }, [choices, selectedSongId]);

  function openAction(id: number) {
    setSelectedSongId(id);
  }

  function closeAction() {
    setSelectedSongId(null);
  }

  const songBalance = useTokenBalance(account ?? undefined, chainId ? SONG[chainId] : undefined);
  const [voteAmount, setVoteAmount] = useState('');
  const parsedAmount = useMemo(
    () => tryParseCurrencyAmount(voteAmount, chainId && SONG[chainId] ? SONG[chainId] : undefined),
    [chainId, voteAmount],
  );

  const insufficientBalance = useMemo(
    () => songBalance && parsedAmount && songBalance.lessThan(parsedAmount),
    [parsedAmount, songBalance],
  );

  const [approvalSong, approveSongCallback] = useApproveCallback(
    parsedAmount,
    chainId ? ARENA_ADDRESS[chainId] : undefined,
  );

  const { callback: voteCallback } = useVoteCallback(
    Number(topicId),
    Number(selectedSongId),
    parsedAmount?.quotient.toString() || '0',
    selectedSong?.description || '',
  );
  const [loading, setLoading] = useState(false);

  const songSymbol = songBalance?.currency.symbol || 'SONG';

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleVote = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await voteCallback?.();
    } catch (e) {
      console.log('vote failed');
      console.log(e);
    }
    if (mounted.current) {
      setLoading(false);
    }
  };

  function renderButton() {
    if (!active) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large'} onClick={tryActivation}>
          Connect Wallet
        </button>
      );
    }
    if (!Number(voteAmount)) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Enter Amount
        </button>
      );
    }
    if (insufficientBalance) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Insufficient {songSymbol} balance
        </button>
      );
    }
    if (approvalSong === ApprovalState.NOT_APPROVED) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={approveSongCallback}>
          Approve {songSymbol}
        </button>
      );
    }
    if (approvalSong === ApprovalState.PENDING) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Waiting for Approve...
        </button>
      );
    }
    if (approvalSong === ApprovalState.UNKNOWN) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Loading Approval State...
        </button>
      );
    }
    if (loading) {
      return (
        <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'}>
          Sending Transaction...
        </button>
      );
    }
    return (
      <button data-testid="cast-vote-btn" className={'btn-primary btn-large w-56'} onClick={handleVote}>
        Cast <span className={'font-bold'}>{formatBalance(voteAmount, 3)}</span> {songSymbol}
      </button>
    );
  }

  function modalContent() {
    return (
      <>
        <main className={'flex flex-wrap gap-6'}>
          {choices.map((song) => {
            return (
              <div
                onClick={() => openAction(song.id)}
                key={song.id}
                className={'w-64 h-24 bg-cover relative'}
                data-testid={`category-list-item-${song.id}-choose`}
              >
                {/* todo #alimahdiyar img below must be an iframe link to youtube video*/}
                <img
                  alt="choice"
                  src={'https://bafybeicp7kjqwzzyfuryefv2l5q23exl3dbd6rgmuqzxs3cy6vaa2iekka.ipfs.w3s.link/sample.png'}
                  className={'rounded-xl w-full h-full'}
                />
                <div className={'px-2 pt-1 absolute inset-0'}>
                  <p className={'font-bold text-xl'}>{song.description}</p>
                </div>
              </div>
            );
          })}
        </main>
        <Transition
          as={Fragment}
          show={selectedSongId !== null}
          enter="transform ease-in-out transition duration-[400ms]"
          enterFrom="opacity-0 translate-y-32"
          enterTo="opacity-100 translate-y-0"
          leave="transform duration-500 transition ease-in-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0 translate-y-32 "
        >
          <footer className={'px-4 py-2 absolute left-0 right-0 bottom-0 bg-white border-gray border-t py-4 px-2'}>
            <section className={'flex'}>
              <div className={'flex-1'}>
                <p className={''}>
                  <span>{selectedSong?.description}</span> selected
                </p>
                <p className={''}>
                  {active ? 'Enter the amount that you want to cast' : 'Connect your wallet to cast your vote'}
                </p>
              </div>
              <div className={'flex-1'}>
                <Input
                  testid="vote-amount"
                  currencyBalance={songBalance}
                  placeholder="Enter Amount"
                  value={voteAmount}
                  onUserInput={setVoteAmount}
                />
              </div>
            </section>
            <section className={'vote-modal-action flex justify-end mt-8'}>
              <button onClick={closeAction} className={'btn-primary-inverted btn-large mr-2'}>
                Go back
              </button>
              {renderButton()}
            </section>
            {/* footer action */}
          </footer>
        </Transition>
      </>
    );
  }

  return (
    <Modal
      className={'!max-w-2xl relative overflow-hidden'}
      {...props}
      title={`Select the song you want to vote for (${choices.length} songs nominated)`}
    >
      {loaded ? modalContent() : <div>loading</div>}
    </Modal>
  );
};

export default VoteSongModal;
