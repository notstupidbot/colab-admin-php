from g2p_id import G2P
import sys
import mimetypes
g2p = G2P()
def main():
    mimetypes._winreg = None
    if len(sys.argv) > 1:
        input_text = sys.argv[1] 
        output_file = sys.argv[2] 
        output_text = g2p(input_text)
        with open(output_file,"w",encoding="utf-8") as f:
            f.write(output_text)
            print("output to %s" % (output_file))


if __name__ == "__main__":
    main()