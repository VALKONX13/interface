import React, { useMemo } from 'react';
import { BigNumber } from '@ethersproject/bignumber';
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { calculateGasMargin } from 'utils/calculateGasMargin';
import isZero from 'utils/isZero';

interface Call {
  address: string;
  calldata: string;
  value: string;
}

interface CallEstimate {
  call: Call;
}

interface SuccessfulCall extends CallEstimate {
  call: Call;
  gasEstimate: BigNumber;
}

interface FailedCall extends CallEstimate {
  call: Call;
  error: Error;
}

// returns a function that will execute a swap, if the parameters are all valid
export default function useArenaTransaction(
  account: string | null | undefined,
  chainId: number | undefined,
  provider: JsonRpcProvider | undefined,
  calls: Call[],
): { callback: null | (() => Promise<TransactionResponse>) } {
  return useMemo(() => {
    if (!provider || !account || !chainId) {
      return { callback: null };
    }
    return {
      callback: async function onSwap(): Promise<TransactionResponse> {
        const estimatedCalls: CallEstimate[] = await Promise.all(
          calls.map((call) => {
            const { address, calldata, value } = call;

            const tx =
              !value || isZero(value)
                ? { from: account, to: address, data: calldata }
                : {
                    from: account,
                    to: address,
                    data: calldata,
                    value,
                  };

            return provider
              .estimateGas(tx)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                };
              })
              .catch((gasError) => {
                console.debug('Gas estimate failed, trying eth_call to extract error', call);

                return provider
                  .call(tx)
                  .then((result) => {
                    console.debug('Unexpected successful call after failed estimate gas', call, gasError, result);
                    return { call, error: <div>Unexpected issue with estimating the gas. Please try again.</div> };
                  })
                  .catch((callError) => {
                    console.debug('Call threw error', call, callError);
                    return { call, error: callError.reason ?? callError.message ?? 'Error' };
                  });
              });
          }),
        );

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        let bestCallOption: SuccessfulCall | CallEstimate | undefined = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        );

        // check if any calls errored with a recognizable error
        if (!bestCallOption) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call);
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error;
          const firstNoErrorCall = estimatedCalls.find<CallEstimate>(
            (call): call is CallEstimate => !('error' in call),
          );
          if (!firstNoErrorCall) throw new Error(`Unexpected error. Could not estimate gas for the swap.`);
          bestCallOption = firstNoErrorCall;
        }

        const {
          call: { address, calldata, value },
        } = bestCallOption;

        return provider
          .getSigner()
          .sendTransaction({
            from: account,
            to: address,
            data: calldata,
            // let the wallet try if we can't estimate the gas
            ...('gasEstimate' in bestCallOption ? { gasLimit: calculateGasMargin(bestCallOption.gasEstimate) } : {}),
            ...(value && !isZero(value) ? { value } : {}),
          })
          .then((response) => {
            return response;
          })
          .catch((error) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error(`Transaction rejected`);
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Arena Transaction failed`);

              throw new Error(`Arena Transaction failed: ${error.reason ?? error.message ?? ''}`);
            }
          });
      },
    };
  }, [account, chainId, provider, calls]);
}
