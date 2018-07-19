.. index:: ! escrow-appendix
.. _escrow-appendix:


###############
Escrow Appendix
###############

Functions
~~~~~~~~~

================    ====================================================
ID                  Ef1
================    ====================================================
Name                ``hasSufficientBalance``

Description         | Requirement function for determining whether or not sender has sufficient balance
                    | for an escrow withdrawal.


Contract            ``Escrow.sol``

Emits               *None*

Parameters          | ``uint256`` **_amount** -- amount to be assessed for withdrawl

Requirements        *None*

Returns             ``bool`` success of transfer
================    ====================================================



================    ====================================================
ID                  Ef2
================    ====================================================
Name                ``withdrawFrom``

Description         | Escrow function for withdrawing a balance amount from the targeted address, in
                    | order to be held in escrow. This function is used when staking to query or depositing
                    | for moderation.


Contract            ``Escrow.sol``

Emits               *None*

Parameters          | ``uint256`` **_amount** --  amount to be withdrawn
                    | ``address`` **_target** -- account from which amount is withdrawn


Requirements        *None*

Returns             *None*
================    ====================================================


================    ====================================================
ID                  Ef3
================    ====================================================
Name                ``depositTo``

Description         | Escrow function for depositing a balance amount to the targeted address, in order to
                    | release from escrow. This function is used when sending payment for content or
                    | moderation.


Contract            ``Escrow.sol``

Emits               *None*

Parameters          | ``uint256`` **_amount** --  amount to be deposited
                    | ``address`` **_target** -- account to which amount is being deposited


Requirements        *None*

Returns             *None*
================    ====================================================
