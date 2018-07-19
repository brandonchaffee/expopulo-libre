.. index:: ! payment-appendix
.. _payment-appendix:


################
Payment Appendix
################

Functions
~~~~~~~~~

================    ====================================================
ID                  Pf1
================    ====================================================
Name                ``stakeBounty``

Description         | Stakes bounty to a specific query with a token balance escrow withdraw, to be
                    | disbursed as payment to responders of the query.


Contract            ``Payment.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query hash targeted for bounty staking
                    | ``uint256`` **_amount** -- amount being staked


Requirements        - The query hash must be initialzied, from **Ps1**
                    - Sender must have sufficient balance, from **Ef1**

Returns             *None*
================    ====================================================


================    ====================================================
ID                  Pf2
================    ====================================================
Name                ``disburseBounty``

Description         | Disburse the sender bounty of a query to the creator of a specific response that
                    | satisfies the query. This initailzies the escrow window to provide break between
                    | disbursement and retrieval of bounty.


Contract            ``Payment.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query hash to which the bounty was staked
                    | ``bytes32`` **_rHash** -- response hash to which the bounty is being disbursed
                    | ``uint256`` **_amount** -- amount being disbursed


Requirements        - The query hash must be initialzied, from **Ps1**
                    - The response hash must be initialzied, from **Ps1**
                    - The response must currently be valid, not in moderation or invalidated, from **Ps2**
                    - Response must have been made to the query in question, from **Ps5**
                    - Amount being disbursed must not exceed staked amount of sender

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf3
================    ====================================================
Name                ``retrieveBounty``

Description         | Retrieves bounty payment from disbursement and transfers balance value to the
                    | sender. This must be done after the escrow window has closed, to allow time for
                    | moderation.


Contract            ``Payment.sol``

Emits               *None*

Parameters          | ``bytes32`` **_rHash** -- response hash from which the bounty is being retrieved
                    | ``address`` **_disburser** -- address of individual that disbursed bounty payment


Requirements        - The response hash must be initialzied, from **Ps1**
                    - The response must currently be valid, not in moderation or invalidated, from **Ps2**
                    - The sender must be the owner of the response, from **Ps3**
                    - The disbursement must be outside the moderation window, from **Ps4**

Returns             *None*
================    ====================================================



================    ====================================================
ID                  Pf4
================    ====================================================
Name                ``recallDisbursement``

Description         | Recalls a bounty distribution, whether for the purpose of retrieving from an
                    | invalidated response or disbursement or if the disbursement was made accidentally.


Contract            ``Payment.sol``

Emits               *None*

Parameters          | ``bytes32`` **_qHash** -- query hash from which the bounty was disbursed
                    | ``bytes32`` **_rHash** -- response to which the bounty is being disbursed


Requirements        - The query hash must be initialzied, from **Ps1**
                    - The response hash must be initialzied, from **Ps1**
                    - Response must have been made to the query in question, from **Ps5**

Returns             *None*
================    ====================================================



Structures
~~~~~~~~~~

================    ====================================================
ID                  Ps1
================    ====================================================
Name                ``initialized``

Contract            ``Payment.sol``

Description         | Modifier function for requiring that the content (query or response) has been
                    | initialized by check that the owner value is non-zero.

Type                ``modifier``
================    ====================================================


================    ====================================================
ID                  Ps2
================    ====================================================
Name                ``validResponse``

Contract            ``Payment.sol``

Description         | Modifier function for requiring that the response is has not been invalidated through
                    | challenge or moderation. This is used when disbursing payment.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ps3
================    ====================================================
Name                ``isOwner``

Contract            ``Payment.sol``

Description         | Modifier function for requiring that the sender of a function is the owner of the
                    | content in question.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ps4
================    ====================================================
Name                ``outEscrowWindow``

Contract            ``Payment.sol``

Description         | Modifier function for requiring that the content (query or response) is outside of the
                    | moderation window, after a challenge or moderation period.

Type                ``modifier``
================    ====================================================



================    ====================================================
ID                  Ps5
================    ====================================================
Name                ``isResponseTo``

Contract            ``Payment.sol``

Description         | Modifier function for requiring that the reponse is question was directed to the query
                    | in question.

Type                ``modifier``
================    ====================================================
