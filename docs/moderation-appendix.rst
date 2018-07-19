.. index:: ! moderation-appendix
.. _moderation-appendix:


###################
Moderation Appendix
###################

Functions
~~~~~~~~~

================    ====================================================
ID                  BTf1
================    ====================================================
Name                ``transfer``

Description         | Balance transfer function equivalent to StandardToken's ``transfer`` with the addition
                    | of the requirement that the sender cannot be currently in a vote so as to maintain the
                    | proper amount of voting rights.


Contract            ``BlockableTransfer.sol``

Emits               ``Transfer``

Parameters          | ``address`` **_to** -- where transfer is going to
                    | ``uint256`` **_value** -- amount being transfered


Requirements        - Sender must not be currently in a vote
                    - Recipient must not be from zero ``address``
                    - Sender must have sufficient balance

Returns             ``bool`` success of transfer
================    ====================================================


Structures
~~~~~~~~~~


================    ====================================================
ID                  ESs0
================    ====================================================
Name                ``ratioDenominator``

Contract            ``Ratio.sol``

Description         | Ratio denominator for determining the proportional value of yes to no votes in order
                    | for a mdification to be approved

Type                ``uint256``
================    ====================================================
