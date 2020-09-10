/**
 * Enables blocks thinner then 0.2F to have particles and acknowledge when an entity walks on them.
 *
 * This is done by making the total subtracted 0.0625 (1/16th of a block)
 * [actually a bit more due to rounding, but correcting for that makes carpet have particles thus changing vanilla block behaviour]
 *
 * Before: MathHelper.floor(this.posY - (double)0.2F);
 * After: MathHelper.floor(this.posY + 0.1375D - (double)0.2F);
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Made with help from:
 * https://cadiboo.github.io/tutorials/1.13.2/forge/99.99-coremod/
 * https://raw.githubusercontent.com/Cadiboo/NoCubes/1.14.x/src/main/resources/nocubes-transformer.js
 */

function initializeCoreMod() {
    Opcodes = Java.type("org.objectweb.asm.Opcodes");
    ASMAPI = Java.type("net.minecraftforge.coremod.api.ASMAPI");
    InsnList = Java.type("org.objectweb.asm.tree.InsnList");
    LdcInsn = Java.type("org.objectweb.asm.tree.LdcInsnNode");
    Insn = Java.type("org.objectweb.asm.tree.InsnNode");

    return {
        "Entity.getOnPosition": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.entity.Entity",
                "methodName": ASMAPI.mapMethod("func_226268_ag_"),
                "methodDesc": "()Lnet/minecraft/util/math/BlockPos;"
            },
            "transformer": function(methodNode) {
                print("Starting Transform: ShetiPhianCore/recognise-thinner-blocks.js 'Entity.getOnPosition'"); // this.posY
                inject2(methodNode.instructions, "net/minecraft/entity/Entity", Opcodes.GETFIELD, ASMAPI.mapField("field_233557_ao_"), "Lnet/minecraft/util/math/vector/Vector3d;", "net/minecraft/util/math/vector/Vector3d", Opcodes.GETFIELD, ASMAPI.mapField("field_72448_b"), "D");
                return methodNode;
            }
        },
        "Entity.createRunningParticles": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.entity.Entity",
                "methodName": ASMAPI.mapMethod("func_233569_aL_"),
                "methodDesc": "()V"
            },
            "transformer": function(methodNode) {
                print("Starting Transform: ShetiPhianCore/recognise-thinner-blocks.js 'Entity.createRunningParticles'"); // getPosY()
                inject(methodNode.instructions, "net/minecraft/entity/Entity", Opcodes.INVOKEVIRTUAL, ASMAPI.mapMethod("func_226278_cu_"), "()D");
                return methodNode;
            }
        },
        "LivingEntity.playFallSound": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.entity.LivingEntity",
                "methodName": ASMAPI.mapMethod("func_226295_cZ_"),
                "methodDesc": "()V"
            },
            "transformer": function(methodNode) {
                print("Starting Transform: ShetiPhianCore/recognise-thinner-blocks.js 'LivingEntity.playFallSound'"); // getPosY()
                inject(methodNode.instructions, "net/minecraft/entity/LivingEntity", Opcodes.INVOKEVIRTUAL, ASMAPI.mapMethod("func_226278_cu_"), "()D");
                return methodNode;
            }
        },
        "IronGolemEntity.livingTick": {
            "target": {
                "type": "METHOD",
                "class": "net.minecraft.entity.passive.IronGolemEntity",
                "methodName": ASMAPI.mapMethod("func_70636_d"),
                "methodDesc": "()V"
            },
            "transformer": function(methodNode) {
                print("Starting Transform: ShetiPhianCore/recognise-thinner-blocks.js 'IronGolemEntity.livingTick'"); // getPosY()
                inject(methodNode.instructions, "net/minecraft/entity/passive/IronGolemEntity", Opcodes.INVOKEVIRTUAL, ASMAPI.mapMethod("func_226278_cu_"), "()D");
                return methodNode;
            }
        }
    };
}

function inject(instructions, owner, opcode, name, desc) {
    var found;
    for (var i = 0; i < instructions.size(); ++i) {
        var instruction = instructions.get(i);
        if (check(instruction, owner, opcode, name, desc)) {
            found = instruction;
            print("Found injection point '" + owner + "." + name + "' " + instruction);
            break;
        }
    }
    if (!found) {
        throw "Error: Couldn't find injection point '" + owner + "." + name + "'!";
    }
    var toInject = new InsnList();
    toInject.add(new LdcInsn(0.1375));
    toInject.add(new Insn(Opcodes.DADD));
    instructions.insert(found, toInject);
    print("Instructions Injected");
}

function check(instruction, owner, opcode, name, desc)
{
    if (instruction.getOpcode() == opcode) {
        if (instruction.owner == owner) {
            if (instruction.name == name) {
                if (instruction.desc == desc) {
                    return true;
                }
            }
        }
    }
    return false;
}

function inject2(instructions, owner, opcode, name, desc, next_owner, next_opcode, next_name, next_desc) {
    var found;
    for (var i = 0; i < instructions.size(); ++i) {
        var instruction = instructions.get(i);
        if (check(instruction, owner, opcode, name, desc)) {
            instruction = instructions.get(i + 1)
            if (check(instruction, next_owner, next_opcode, next_name, next_desc)) {
                found = instruction;
                print("Found injection point '" + owner + "." + name + "' " + instruction);
                break;
            }
        }
    }
    if (!found) {
        throw "Error: Couldn't find injection point '" + owner + "." + name + "'!";
    }
    var toInject = new InsnList();
    toInject.add(new LdcInsn(0.1375));
    toInject.add(new Insn(Opcodes.DADD));
    instructions.insert(found, toInject);
    print("Instructions Injected");
}